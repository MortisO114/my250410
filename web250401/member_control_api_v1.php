<?php
header("Content-Type: application/json; charset=UTF-8");

const DB_SERVER   = "localhost";
const DB_USERNAME = "owner01";
const DB_PASSWORD = "123456";
const DB_NAME     = "testdb";

// 建立連線
function create_connection()
{
    $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    if (!$conn) {
        echo json_encode(["state" => false, "message" => "連線失敗!"]);
        exit;
    }
    return $conn;
}

// 取得 JSON 的資料
function get_json_input()
{
    $data = file_get_contents("php://input");
    return json_decode($data, true);
}

// 回復 JSON 訊息
function respond($state, $message, $data = null)
{
    echo json_encode(["state" => $state, "message" => $message, "data" => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

// 檢查用戶名是否已存在（排除特定 ID）
function check_username_exists($conn, $username, $exclude_id = null)
{
    $stmt = $conn->prepare("SELECT ID FROM member WHERE Username = ? AND ID != ?");
    if (!$stmt) {
        throw new Exception("SQL 準備失敗：" . $conn->error);
    }
    $stmt->bind_param("si", $username, $exclude_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $exists = $result->num_rows > 0;
    $stmt->close();
    return $exists;
}

// 會員註冊（支持 Region）
function register_user()
{
    $input = get_json_input();
    if (isset($input["username"], $input["password"], $input["email"])) {
        $p_username = trim($input["username"]);
        $p_password = password_hash(trim($input["password"]), PASSWORD_DEFAULT);
        $p_email = trim($input["email"]);
        $p_region = isset($input["region"]) ? trim($input["region"]) : null;
        $p_level = 10; // 預設 Level 為 10（普通用戶）
        if ($p_username && $p_password && $p_email) {
            $conn = create_connection();

            try {
                // 檢查用戶名是否已存在
                if (check_username_exists($conn, $p_username)) {
                    respond(false, "這個使用者名稱已有人使用，請嘗試其他名稱。");
                    return;
                }

                // 插入新用戶
                $stmt = $conn->prepare("INSERT INTO member(Username, Password, Email, Region, Level) VALUES(?, ?, ?, ?, ?)");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("ssssi", $p_username, $p_password, $p_email, $p_region, $p_level);
                if ($stmt->execute()) {
                    respond(true, "註冊成功");
                } else {
                    throw new Exception("資料庫插入失敗：" . $stmt->error);
                }
            } catch (Exception $e) {
                error_log("註冊失敗：用戶名 $p_username 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "註冊失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不得為空");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// 後台新增用戶（支持 Region 和 Level）
function add_user()
{
    $input = get_json_input();
    if (!isset($input["uid01"])) {
        respond(false, "缺少 Uid01，無法驗證權限");
        return;
    }

    // 檢查執行者是否為管理員
    if (!check_admin_permission($input["uid01"])) {
        return;
    }

    if (isset($input["username"], $input["password"], $input["email"], $input["region"], $input["level"])) {
        $p_username = trim($input["username"]);
        $p_password = password_hash(trim($input["password"]), PASSWORD_DEFAULT);
        $p_email = trim($input["email"]);
        $p_region = trim($input["region"]);
        $p_level = (int) trim($input["level"]);
        if ($p_username && $p_password && $p_email && $p_region && $p_level) {
            $conn = create_connection();

            try {
                // 檢查用戶名是否已存在
                if (check_username_exists($conn, $p_username)) {
                    respond(false, "這個使用者名稱已有人使用，請嘗試其他名稱。");
                    return;
                }

                // 驗證 Level 值是否有效
                $valid_levels = [10, 20, 30, 50]; // 允許管理員設置 Level 50
                if (!in_array($p_level, $valid_levels)) {
                    respond(false, "無效的等級值，請選擇有效的等級。");
                    return;
                }

                // 插入新用戶
                $stmt = $conn->prepare("INSERT INTO member(Username, Password, Email, Region, Level) VALUES(?, ?, ?, ?, ?)");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("ssssi", $p_username, $p_password, $p_email, $p_region, $p_level);
                if ($stmt->execute()) {
                    respond(true, "新增用戶成功");
                } else {
                    throw new Exception("資料庫插入失敗：" . $stmt->error);
                }
            } catch (Exception $e) {
                error_log("新增用戶失敗：用戶名 $p_username 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "新增用戶失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不得為空");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// 會員登入（返回 Level）
function login_user()
{
    $input = get_json_input();
    if (isset($input["username"], $input["password"])) {
        $p_username = trim($input["username"]);
        $p_password = trim($input["password"]);
        if ($p_username && $p_password) {
            $conn = create_connection();

            try {
                $stmt = $conn->prepare("SELECT * FROM member WHERE Username = ?");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("s", $p_username);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    $row = $result->fetch_assoc();
                    if (password_verify($p_password, $row["Password"])) {
                        $uid01 = substr(hash('sha256', time()), 10, 4) . substr(bin2hex(random_bytes(16)), 4, 4);
                        $update_stmt = $conn->prepare("UPDATE member SET Uid01 = ? WHERE Username = ?");
                        if (!$update_stmt) {
                            throw new Exception("SQL 準備失敗：" . $conn->error);
                        }
                        $update_stmt->bind_param('ss', $uid01, $p_username);
                        if ($update_stmt->execute()) {
                            $user_stmt = $conn->prepare("SELECT Username, Email, Uid01, Created_at, Region, Level FROM member WHERE Username = ?");
                            if (!$user_stmt) {
                                throw new Exception("SQL 準備失敗：" . $conn->error);
                            }
                            $user_stmt->bind_param("s", $p_username);
                            $user_stmt->execute();
                            $user_data = $user_stmt->get_result()->fetch_assoc();
                            respond(true, "登入成功", $user_data);
                        } else {
                            throw new Exception("UID 更新失敗");
                        }
                    } else {
                        respond(false, "登入失敗，密碼錯誤");
                    }
                } else {
                    respond(false, "登入失敗，該帳號不存在");
                }
            } catch (Exception $e) {
                error_log("登入失敗：用戶名 $p_username 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "登入失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不得為空");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// Uid01 驗證（檢查 Level）
function check_uid() {
    $input = get_json_input();
    if (isset($input["uid01"])) {
        $p_uid = trim($input["uid01"]);
        if ($p_uid) {
            $conn = create_connection();

            try {
                $stmt = $conn->prepare("SELECT Username, Email, Uid01, Created_at, Region, Level FROM member WHERE Uid01 = ?");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("s", $p_uid);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    $userdata = $result->fetch_assoc();
                    respond(true, "驗證成功", $userdata);
                } else {
                    respond(false, "驗證失敗");
                }
            } catch (Exception $e) {
                error_log("Uid01 驗證失敗：Uid01 $p_uid 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "驗證失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不得為空");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// 檢查執行者是否為管理員 (Level 50)
function check_admin_permission($uid01)
{
    if (!$uid01) {
        respond(false, "缺少 Uid01，無法驗證權限");
        return false;
    }

    $conn = create_connection();
    try {
        $stmt = $conn->prepare("SELECT Level FROM member WHERE Uid01 = ?");
        if (!$stmt) {
            throw new Exception("SQL 準備失敗：" . $conn->error);
        }
        $stmt->bind_param("s", $uid01);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if ($user["Level"] == 50) {
                return true; // 是管理員
            } else {
                respond(false, "權限不足，只有管理員 (Level 50) 可以執行此操作");
                return false;
            }
        } else {
            respond(false, "Uid01 無效，無法驗證權限");
            return false;
        }
    } catch (Exception $e) {
        error_log("權限檢查失敗：Uid01 $uid01 錯誤：" . $e->getMessage(), 3, "error.log");
        respond(false, "權限檢查失敗：" . $e->getMessage());
        return false;
    } finally {
        if (isset($stmt)) {
            $stmt->close();
        }
        if (isset($conn)) {
            $conn->close();
        }
    }
}

// 驗證帳號是否已經存在
function check_uni_username()
{
    $input = get_json_input();
    if (isset($input["username"])) {
        $p_username = trim($input["username"]);
        if ($p_username) {
            $conn = create_connection();

            try {
                $stmt = $conn->prepare("SELECT Username FROM member WHERE Username = ?");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("s", $p_username);
                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows === 1) {
                    respond(false, "這個使用者名稱已有人使用，請嘗試其他名稱。");
                } else {
                    respond(true, "帳號不存在，可以使用");
                }
            } catch (Exception $e) {
                error_log("檢查用戶名失敗：用戶名 $p_username 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "檢查失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不能空白");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// 取得所有會員資料
function get_all_user_data() {
    // 直接從 GET 參數中獲取 uid01
    $uid01 = $_GET["uid01"] ?? null;

    if (!$uid01) {
        respond(false, "缺少 Uid01，無法驗證權限");
        return;
    }

    // 檢查執行者是否為管理員
    if (!check_admin_permission($uid01)) {
        return;
    }

    $conn = create_connection();

    try {
        $stmt = $conn->prepare("SELECT ID, Username, Email, Region, Created_at, Level FROM member ORDER BY ID DESC");
        if (!$stmt) {
            throw new Exception("SQL 準備失敗：" . $conn->error);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $mydata = array();
            while ($row = $result->fetch_assoc()) {
                $mydata[] = $row;
            }
            respond(true, "取得所有會員資料成功", $mydata);
        } else {
            respond(false, "查無資料");
        }
    } catch (Exception $e) {
        error_log("獲取用戶失敗：錯誤：" . $e->getMessage(), 3, "error.log");
        respond(false, "獲取用戶失敗：" . $e->getMessage());
    } finally {
        if (isset($stmt)) {
            $stmt->close();
        }
        if (isset($conn)) {
            $conn->close();
        }
    }
}

// 會員更新（允許更新用戶名和電子郵件）
function update_user() {
    $input = get_json_input();
    if (!isset($input["uid01"])) {
        respond(false, "缺少 Uid01，無法驗證權限");
        return;
    }

    // 檢查執行者是否為管理員
    if (!check_admin_permission($input["uid01"])) {
        return;
    }

    if (isset($input["id"], $input["username"], $input["email"])) {
        $p_id = trim($input["id"]);
        $p_username = trim($input["username"]);
        $p_email = trim($input["email"]);
        if ($p_id && $p_username && $p_email) {
            $conn = create_connection();

            try {
                // 檢查用戶名是否已被其他用戶使用
                if (check_username_exists($conn, $p_username, $p_id)) {
                    respond(false, "這個使用者名稱已有人使用，請嘗試其他名稱。");
                    return;
                }

                $stmt = $conn->prepare("UPDATE member SET Username = ?, Email = ? WHERE ID = ?");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("ssi", $p_username, $p_email, $p_id);
                if ($stmt->execute()) {
                    respond(true, "會員更新成功");
                } else {
                    throw new Exception("會員更新失敗：" . $stmt->error);
                }
            } catch (Exception $e) {
                error_log("更新用戶失敗：ID $p_id 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "會員更新失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不能空白");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// 會員刪除
function delete_user() {
    $input = get_json_input();
    if (!isset($input["uid01"])) {
        respond(false, "缺少 Uid01，無法驗證權限");
        return;
    }

    // 檢查執行者是否為管理員
    if (!check_admin_permission($input["uid01"])) {
        return;
    }

    if (isset($input["id"])) {
        $p_id = trim($input["id"]);
        if ($p_id) {
            $conn = create_connection();

            try {
                $stmt = $conn->prepare("DELETE FROM member WHERE ID = ?");
                if (!$stmt) {
                    throw new Exception("SQL 準備失敗：" . $conn->error);
                }
                $stmt->bind_param("i", $p_id);
                if ($stmt->execute()) {
                    if ($stmt->affected_rows === 1) {
                        respond(true, "會員刪除成功");
                    } else {
                        respond(false, "會員刪除失敗，無此用戶");
                    }
                } else {
                    throw new Exception("會員刪除失敗：" . $stmt->error);
                }
            } catch (Exception $e) {
                error_log("刪除用戶失敗：ID $p_id 錯誤：" . $e->getMessage(), 3, "error.log");
                respond(false, "會員刪除失敗：" . $e->getMessage());
            } finally {
                if (isset($stmt)) {
                    $stmt->close();
                }
                if (isset($conn)) {
                    $conn->close();
                }
            }
        } else {
            respond(false, "欄位不能空白");
        }
    } else {
        respond(false, "欄位錯誤");
    }
}

// 主程式
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'register':
            register_user();
            break;
        case 'login':
            login_user();
            break;
        case 'checkuid':
            check_uid();
            break;
        case 'checkuni':
            check_uni_username();
            break;
        case 'update_user':
            update_user();
            break;
        case 'add_user':
            add_user();
            break;
        default:
            respond(false, "操作無效");
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'getalldata':
            get_all_user_data();
            break;
        default:
            respond(false, "操作無效");
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'delete':
            delete_user();
            break;
        default:
            respond(false, "操作無效");
    }
} else {
    respond(false, "請求無效");
}
