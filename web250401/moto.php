<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // 允許跨域請求，根據需求調整

// 資料庫連線設定
const DB_SERVER   = "localhost";
const DB_USERNAME = "owner01";
const DB_PASSWORD = "123456";
const DB_NAME     = "testdb";

// 建立連線
function create_connection() {
    $conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    if (!$conn) {
        respond(false, "連線失敗!");
        exit;
    }
    return $conn;
}

// 回復 JSON 訊息
// state: 狀態(成功或失敗) message: 訊息內容 data: 回傳資料(可有可無)
function respond($state, $message, $data = null) {
    echo json_encode(["state" => $state, "message" => $message, "data" => $data]);
}

// 匯入車款資料
function import_bikes() {
    $jsonData = '{
        "250cc以下": [
            {"value": "honda_cbr150", "text": "Honda CBR150R"},
            {"value": "honda_cbr250rr", "text": "Honda CBR250RR"},
            {"value": "honda_crf150", "text": "Honda CRF150"},
            {"value": "yamaha_mt15", "text": "Yamaha MT15"},
            {"value": "yamaha_r15", "text": "Yamaha YZF-R15"},
            {"value": "yamaha_r25", "text": "Yamaha YZF-R25"},
            {"value": "kawasaki_z250", "text": "Kawasaki Z 250"},
            {"value": "kawasaki_ninja250", "text": "Kawasaki Ninja 250"},
            {"value": "kawasaki_zx25r", "text": "Kawasaki ZX-25R"},
            {"value": "suzuki_gsx150_r", "text": "Suzuki GSX-R150"},
            {"value": "suzuki_gsx150_s", "text": "Suzuki GSX-S150"}
        ],
        "251-600cc": [
            {"value": "honda_crf300", "text": "Honda CRF300"},
            {"value": "honda_cb300r", "text": "Honda CB300R"},
            {"value": "honda_cbr500r", "text": "Honda CBR500R"},
            {"value": "honda_cbr600rr", "text": "Honda CBR600RR"},
            {"value": "honda_cl_street", "text": "Honda CL STREET"},
            {"value": "honda_rebel500", "text": "Honda Rebel500"},
            {"value": "yamaha_mt03", "text": "Yamaha MT03"},
            {"value": "yamaha_r3", "text": "Yamaha YZF-R3"},
            {"value": "yamaha_r6", "text": "Yamaha YZF-R6"},
            {"value": "kawasaki_z400", "text": "Kawasaki Z 400"},
            {"value": "kawasaki_z500", "text": "Kawasaki Z 500"},
            {"value": "kawasaki_ninja300", "text": "Kawasaki Ninja 300"},
            {"value": "kawasaki_ninja400", "text": "Kawasaki Ninja 400"},
            {"value": "kawasaki_ninja500", "text": "Kawasaki Ninja 500"},
            {"value": "kawasaki_zx4rr", "text": "Kawasaki ZX-4RR"},
            {"value": "suzuki_gsx600", "text": "Suzuki GSX-R600"}
        ],
        "601-1000cc": [
            {"value": "honda_cb750hornet", "text": "Honda CB750 Hornet"},
            {"value": "honda_cb650r", "text": "Honda CB650R"},
            {"value": "honda_cb650re-clutch", "text": "Honda CB650R E-Clutch"},
            {"value": "honda_cb1000r", "text": "Honda CB1000R"},
            {"value": "honda_cbr650r", "text": "Honda CBR650R"},
            {"value": "honda_cbr650re-clutch", "text": "Honda CBR650R E-Clutch"},
            {"value": "honda_cbr1000rr", "text": "Honda CBR1000RR"},
            {"value": "honda_rebel1100", "text": "Honda Rebel1100"},
            {"value": "yamaha_mt07", "text": "Yamaha MT07"},
            {"value": "yamaha_mt09", "text": "Yamaha MT09"},
            {"value": "yamaha_mt10", "text": "Yamaha MT10"},
            {"value": "yamaha_r7", "text": "Yamaha YZF-R7"},
            {"value": "yamaha_r1", "text": "Yamaha YZF-R1"},
            {"value": "kawasaki_z650", "text": "Kawasaki Z 650"},
            {"value": "kawasaki_z900", "text": "Kawasaki Z 900"},
            {"value": "kawasaki_ninja650", "text": "Kawasaki Ninja 650"},
            {"value": "kawasaki_ninja1000sx", "text": "Kawasaki Ninja 1000 SX"},
            {"value": "kawasaki_zx6r", "text": "Kawasaki ZX-6R"},
            {"value": "kawasaki_zx10r", "text": "Kawasaki ZX-10R"},
            {"value": "kawasaki_h2r", "text": "Kawasaki Ninja H2R"},
            {"value": "suzuki_gsx1000", "text": "Suzuki GSX-R1000"},
            {"value": "ktm_790duke", "text": "KTM 790 DUKE"},
            {"value": "bmw_s1000rr", "text": "BMW S1000RR"},
            {"value": "ducati_panigale", "text": "Ducati Panigale V4"}
        ]
    }';

    $data = json_decode($jsonData, true);
    $conn = create_connection();

    // 清空現有資料
    $conn->query("TRUNCATE TABLE motorcycles");

    $stmt = $conn->prepare("INSERT INTO motorcycles (category, brand, model, value) VALUES (?, ?, ?, ?)");
    
    $insertedRows = 0;
    foreach ($data as $category => $motorcycles) {
        foreach ($motorcycles as $bike) {
            $textParts = explode(" ", $bike['text'], 2);
            $brand = $textParts[0];
            $model = $textParts[1] ?? '';

            $stmt->bind_param("ssss", $category, $brand, $model, $bike['value']);
            if ($stmt->execute()) {
                $insertedRows++;
            } else {
                respond(false, "資料匯入失敗: " . $stmt->error . " - Category: $category, Value: " . $bike['value']);
                $stmt->close();
                $conn->close();
                return;
            }
        }
    }
    respond(true, "資料已成功匯入，共插入 $insertedRows 筆資料");
    $stmt->close();
    $conn->close();
}

// 獲取車款資料
function get_bikes() {
    $category = $_GET['category'] ?? '';
    $conn = create_connection();

    if ($category) {
        $stmt = $conn->prepare("SELECT value, CONCAT(brand, ' ', model) as text FROM motorcycles WHERE category = ?");
        $stmt->bind_param("s", $category);
        $stmt->execute();
        $result = $stmt->get_result();

        $bikes = [];
        while ($row = $result->fetch_assoc()) {
            $bikes[] = $row;
        }
        if (count($bikes) > 0) {
            respond(true, "車款查詢成功", $bikes);
        } else {
            respond(false, "查無車款資料", []);
        }
    } else {
        $result = $conn->query("SELECT DISTINCT category FROM motorcycles");
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row['category'];
        }
        if (count($categories) > 0) {
            respond(true, "排氣量分類查詢成功", $categories);
        } else {
            respond(false, "查無排氣量分類資料", []);
        }
    }
    $conn->close();
}

// 處理 GET 請求
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';
    switch ($action) {
        case 'import':
            import_bikes();
            break;
        case 'get_bikes':
            get_bikes();
            break;
        default:
            respond(false, "操作無效");
    }
} else {
    respond(false, "請求無效");
}
?>
