import {t as re, j as Z, c as ne, o as oe, E as ie, a as ae, b as se, e as S, f as le, u as V, s as ce} from "./entry.44152e98.js";
import {u as ue} from "./all.7f1b5a03.js";
const ve = "" + new URL("face-cry.6d7b2219.svg",import.meta.url).href;
var ee = {}
  , fe = {
    get exports() {
        return ee
    },
    set exports(N) {
        ee = N
    }
};
(function(N) {
    (function(te) {
        var v = z()
          , B = $()
          , j = Y()
          , L = J()
          , O = {
            imagePlaceholder: void 0,
            cacheBust: !1
        }
          , P = {
            toSvg: u,
            toPng: q,
            toJpeg: I,
            toBlob: D,
            toPixelData: G,
            impl: {
                fontFaces: j,
                images: L,
                util: v,
                inliner: B,
                options: {}
            }
        };
        N.exports = P;
        function u(n, e) {
            return e = e || {},
            g(e),
            Promise.resolve(n).then(function(r) {
                return U(r, e.filter, !0)
            }).then(H).then(X).then(o).then(function(r) {
                return F(r, e.width || v.width(n), e.height || v.height(n))
            });
            function o(r) {
                return e.bgcolor && (r.style.backgroundColor = e.bgcolor),
                e.width && (r.style.width = e.width + "px"),
                e.height && (r.style.height = e.height + "px"),
                e.style && Object.keys(e.style).forEach(function(l) {
                    r.style[l] = e.style[l]
                }),
                r
            }
        }
        function G(n, e) {
            return y(n, e || {}).then(function(o) {
                return o.getContext("2d").getImageData(0, 0, v.width(n), v.height(n)).data
            })
        }
        function q(n, e) {
            return y(n, e || {}).then(function(o) {
                return o.toDataURL()
            })
        }
        function I(n, e) {
            return e = e || {},
            y(n, e).then(function(o) {
                return o.toDataURL("image/jpeg", e.quality || 1)
            })
        }
        function D(n, e) {
            return y(n, e || {}).then(v.canvasToBlob)
        }
        function g(n) {
            typeof n.imagePlaceholder > "u" ? P.impl.options.imagePlaceholder = O.imagePlaceholder : P.impl.options.imagePlaceholder = n.imagePlaceholder,
            typeof n.cacheBust > "u" ? P.impl.options.cacheBust = O.cacheBust : P.impl.options.cacheBust = n.cacheBust
        }
        function y(n, e) {
            return u(n, e).then(v.makeImage).then(v.delay(100)).then(function(r) {
                var l = o(n);
                return l.getContext("2d").drawImage(r, 0, 0),
                l
            });
            function o(r) {
                var l = document.createElement("canvas");
                if (l.width = e.width || v.width(r),
                l.height = e.height || v.height(r),
                e.bgcolor) {
                    var i = l.getContext("2d");
                    i.fillStyle = e.bgcolor,
                    i.fillRect(0, 0, l.width, l.height)
                }
                return l
            }
        }
        function U(n, e, o) {
            if (!o && e && !e(n))
                return Promise.resolve();
            return Promise.resolve(n).then(r).then(function(a) {
                return l(n, a, e)
            }).then(function(a) {
                return i(n, a)
            });
            function r(a) {
                return a instanceof HTMLCanvasElement ? v.makeImage(a.toDataURL()) : a.cloneNode(!1)
            }
            function l(a, s, d) {
                var w = a.childNodes;
                if (w.length === 0)
                    return Promise.resolve(s);
                return m(s, v.asArray(w), d).then(function() {
                    return s
                });
                function m(M, b, p) {
                    var E = Promise.resolve();
                    return b.forEach(function(k) {
                        E = E.then(function() {
                            return U(k, p)
                        }).then(function(T) {
                            T && M.appendChild(T)
                        })
                    }),
                    E
                }
            }
            function i(a, s) {
                if (!(s instanceof Element))
                    return s;
                return Promise.resolve().then(d).then(w).then(m).then(M).then(function() {
                    return s
                });
                function d() {
                    b(window.getComputedStyle(a), s.style);
                    function b(p, E) {
                        p.cssText ? E.cssText = p.cssText : k(p, E);
                        function k(T, R) {
                            v.asArray(T).forEach(function(t) {
                                R.setProperty(t, T.getPropertyValue(t), T.getPropertyPriority(t))
                            })
                        }
                    }
                }
                function w() {
                    [":before", ":after"].forEach(function(p) {
                        b(p)
                    });
                    function b(p) {
                        var E = window.getComputedStyle(a, p)
                          , k = E.getPropertyValue("content");
                        if (k === "" || k === "none")
                            return;
                        var T = v.uid();
                        s.className = s.className + " " + T;
                        var R = document.createElement("style");
                        R.appendChild(t(T, p, E)),
                        s.appendChild(R);
                        function t(c, h, f) {
                            var x = "." + c + ":" + h
                              , C = f.cssText ? K(f) : Q(f);
                            return document.createTextNode(x + "{" + C + "}");
                            function K(_) {
                                var A = _.getPropertyValue("content");
                                return _.cssText + " content: " + A + ";"
                            }
                            function Q(_) {
                                return v.asArray(_).map(A).join("; ") + ";";
                                function A(W) {
                                    return W + ": " + _.getPropertyValue(W) + (_.getPropertyPriority(W) ? " !important" : "")
                                }
                            }
                        }
                    }
                }
                function m() {
                    a instanceof HTMLTextAreaElement && (s.innerHTML = a.value),
                    a instanceof HTMLInputElement && s.setAttribute("value", a.value)
                }
                function M() {
                    s instanceof SVGElement && (s.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
                    s instanceof SVGRectElement && ["width", "height"].forEach(function(b) {
                        var p = s.getAttribute(b);
                        p && s.style.setProperty(b, p)
                    }))
                }
            }
        }
        function H(n) {
            return j.resolveAll().then(function(e) {
                var o = document.createElement("style");
                return n.appendChild(o),
                o.appendChild(document.createTextNode(e)),
                n
            })
        }
        function X(n) {
            return L.inlineAll(n).then(function() {
                return n
            })
        }
        function F(n, e, o) {
            return Promise.resolve(n).then(function(r) {
                return r.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"),
                new XMLSerializer().serializeToString(r)
            }).then(v.escapeXhtml).then(function(r) {
                return '<foreignObject x="0" y="0" width="100%" height="100%">' + r + "</foreignObject>"
            }).then(function(r) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + e + '" height="' + o + '">' + r + "</svg>"
            }).then(function(r) {
                return "data:image/svg+xml;charset=utf-8," + r
            })
        }
        function z() {
            return {
                escape: M,
                parseExtension: e,
                mimeType: o,
                dataAsUrl: m,
                isDataUrl: r,
                canvasToBlob: i,
                resolveUrl: a,
                getAndEncode: w,
                uid: s(),
                delay: b,
                asArray: p,
                escapeXhtml: E,
                makeImage: d,
                width: k,
                height: T
            };
            function n() {
                var t = "application/font-woff"
                  , c = "image/jpeg";
                return {
                    woff: t,
                    woff2: t,
                    ttf: "application/font-truetype",
                    eot: "application/vnd.ms-fontobject",
                    png: "image/png",
                    jpg: c,
                    jpeg: c,
                    gif: "image/gif",
                    tiff: "image/tiff",
                    svg: "image/svg+xml"
                }
            }
            function e(t) {
                var c = /\.([^\.\/]*?)$/g.exec(t);
                return c ? c[1] : ""
            }
            function o(t) {
                var c = e(t).toLowerCase();
                return n()[c] || ""
            }
            function r(t) {
                return t.search(/^(data:)/) !== -1
            }
            function l(t) {
                return new Promise(function(c) {
                    for (var h = window.atob(t.toDataURL().split(",")[1]), f = h.length, x = new Uint8Array(f), C = 0; C < f; C++)
                        x[C] = h.charCodeAt(C);
                    c(new Blob([x],{
                        type: "image/png"
                    }))
                }
                )
            }
            function i(t) {
                return t.toBlob ? new Promise(function(c) {
                    t.toBlob(c)
                }
                ) : l(t)
            }
            function a(t, c) {
                var h = document.implementation.createHTMLDocument()
                  , f = h.createElement("base");
                h.head.appendChild(f);
                var x = h.createElement("a");
                return h.body.appendChild(x),
                f.href = c,
                x.href = t,
                x.href
            }
            function s() {
                var t = 0;
                return function() {
                    return "u" + c() + t++;
                    function c() {
                        return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
                    }
                }
            }
            function d(t) {
                return new Promise(function(c, h) {
                    var f = new Image;
                    f.onload = function() {
                        c(f)
                    }
                    ,
                    f.onerror = h,
                    f.src = t
                }
                )
            }
            function w(t) {
                var c = 3e4;
                return P.impl.options.cacheBust && (t += (/\?/.test(t) ? "&" : "?") + new Date().getTime()),
                new Promise(function(h) {
                    var f = new XMLHttpRequest;
                    f.onreadystatechange = K,
                    f.ontimeout = Q,
                    f.responseType = "blob",
                    f.timeout = c,
                    f.open("GET", t, !0),
                    f.send();
                    var x;
                    if (P.impl.options.imagePlaceholder) {
                        var C = P.impl.options.imagePlaceholder.split(/,/);
                        C && C[1] && (x = C[1])
                    }
                    function K() {
                        if (f.readyState === 4) {
                            if (f.status !== 200) {
                                x ? h(x) : _("cannot fetch resource: " + t + ", status: " + f.status);
                                return
                            }
                            var A = new FileReader;
                            A.onloadend = function() {
                                var W = A.result.split(/,/)[1];
                                h(W)
                            }
                            ,
                            A.readAsDataURL(f.response)
                        }
                    }
                    function Q() {
                        x ? h(x) : _("timeout of " + c + "ms occured while fetching resource: " + t)
                    }
                    function _(A) {
                        console.error(A),
                        h("")
                    }
                }
                )
            }
            function m(t, c) {
                return "data:" + c + ";base64," + t
            }
            function M(t) {
                return t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")
            }
            function b(t) {
                return function(c) {
                    return new Promise(function(h) {
                        setTimeout(function() {
                            h(c)
                        }, t)
                    }
                    )
                }
            }
            function p(t) {
                for (var c = [], h = t.length, f = 0; f < h; f++)
                    c.push(t[f]);
                return c
            }
            function E(t) {
                return t.replace(/#/g, "%23").replace(/\n/g, "%0A")
            }
            function k(t) {
                var c = R(t, "border-left-width")
                  , h = R(t, "border-right-width");
                return t.scrollWidth + c + h
            }
            function T(t) {
                var c = R(t, "border-top-width")
                  , h = R(t, "border-bottom-width");
                return t.scrollHeight + c + h
            }
            function R(t, c) {
                var h = window.getComputedStyle(t).getPropertyValue(c);
                return parseFloat(h.replace("px", ""))
            }
        }
        function $() {
            var n = /url\(['"]?([^'"]+?)['"]?\)/g;
            return {
                inlineAll: l,
                shouldProcess: e,
                impl: {
                    readUrls: o,
                    inline: r
                }
            };
            function e(i) {
                return i.search(n) !== -1
            }
            function o(i) {
                for (var a = [], s; (s = n.exec(i)) !== null; )
                    a.push(s[1]);
                return a.filter(function(d) {
                    return !v.isDataUrl(d)
                })
            }
            function r(i, a, s, d) {
                return Promise.resolve(a).then(function(m) {
                    return s ? v.resolveUrl(m, s) : m
                }).then(d || v.getAndEncode).then(function(m) {
                    return v.dataAsUrl(m, v.mimeType(a))
                }).then(function(m) {
                    return i.replace(w(a), "$1" + m + "$3")
                });
                function w(m) {
                    return new RegExp(`(url\\(['"]?)(` + v.escape(m) + `)(['"]?\\))`,"g")
                }
            }
            function l(i, a, s) {
                if (d())
                    return Promise.resolve(i);
                return Promise.resolve(i).then(o).then(function(w) {
                    var m = Promise.resolve(i);
                    return w.forEach(function(M) {
                        m = m.then(function(b) {
                            return r(b, M, a, s)
                        })
                    }),
                    m
                });
                function d() {
                    return !e(i)
                }
            }
        }
        function Y() {
            return {
                resolveAll: n,
                impl: {
                    readAll: e
                }
            };
            function n() {
                return e().then(function(o) {
                    return Promise.all(o.map(function(r) {
                        return r.resolve()
                    }))
                }).then(function(o) {
                    return o.join(`
`)
                })
            }
            function e() {
                return Promise.resolve(v.asArray(document.styleSheets)).then(r).then(o).then(function(i) {
                    return i.map(l)
                });
                function o(i) {
                    return i.filter(function(a) {
                        return a.type === CSSRule.FONT_FACE_RULE
                    }).filter(function(a) {
                        return B.shouldProcess(a.style.getPropertyValue("src"))
                    })
                }
                function r(i) {
                    var a = [];
                    return i.forEach(function(s) {
                        try {
                            v.asArray(s.cssRules || []).forEach(a.push.bind(a))
                        } catch (d) {
                            "" + s.href,
                            d.toString()
                        }
                    }),
                    a
                }
                function l(i) {
                    return {
                        resolve: function() {
                            var s = (i.parentStyleSheet || {}).href;
                            return B.inlineAll(i.cssText, s)
                        },
                        src: function() {
                            return i.style.getPropertyValue("src")
                        }
                    }
                }
            }
        }
        function J() {
            return {
                inlineAll: e,
                impl: {
                    newImage: n
                }
            };
            function n(o) {
                return {
                    inline: r
                };
                function r(l) {
                    return v.isDataUrl(o.src) ? Promise.resolve() : Promise.resolve(o.src).then(l || v.getAndEncode).then(function(i) {
                        return v.dataAsUrl(i, v.mimeType(o.src))
                    }).then(function(i) {
                        return new Promise(function(a, s) {
                            o.onload = a,
                            o.onerror = s,
                            o.src = i
                        }
                        )
                    })
                }
            }
            function e(o) {
                if (!(o instanceof Element))
                    return Promise.resolve(o);
                return r(o).then(function() {
                    return o instanceof HTMLImageElement ? n(o).inline() : Promise.all(v.asArray(o.childNodes).map(function(l) {
                        return e(l)
                    }))
                });
                function r(l) {
                    var i = l.style.getPropertyValue("background");
                    return i ? B.inlineAll(i).then(function(a) {
                        l.style.setProperty("background", a, l.style.getPropertyPriority("background"))
                    }).then(function() {
                        return l
                    }) : Promise.resolve(l)
                }
            }
        }
    }
    )()
}
)(fe);
const he = ee;
const me = {
    class: "absolute left-0 top-0 z-[2] h-full w-full overflow-y-auto"
}
  , de = {
    class: "min-h-full space-y-4 p-20"
}
  , ge = {
    class: "flex items-center justify-between gap-6"
}
  , pe = {
    class: "zh-text-head-1 text-pr flex w-max bg-[#B9B9B9] px-3 py-1"
}
  , xe = S("img", {
    id: "testImg",
    class: "h-full",
    src: ve,
    alt: "timeout"
}, null, -1)
  , ye = ["innerHTML"]
  , Ee = {
    __name: "TimeOutCover.client",
    emits: ["re-cal-time-out"],
    setup(N, {emit: te}) {
        const v = ue()
          , {globalOptions: B} = re(v)
          , j = Z(!1)
          , L = Z(null)
          , O = ne( () => B.value.overtime.solution_title)
          , P = ne( () => B.value.overtime.solution_content)
          , u = Z(null);
        class G {
            constructor() {
                this.uniforms = {
                    resolution: {
                        type: "v2",
                        value: new window.THREE.Vector2(u.value.scrollWidth,u.value.scrollHeight)
                    },
                    imageResolution: {
                        type: "v2",
                        value: new window.THREE.Vector2(u.value.scrollWidth,u.value.scrollHeight)
                    },
                    texture: {
                        type: "t",
                        value: null
                    }
                },
                this.obj = null
            }
            init(g, y) {
                const U = new window.THREE.TextureLoader;
                U.crossOrigin = "*",
                U.load(g, H => {
                    H.magFilter = window.THREE.NearestFilter,
                    H.minFilter = window.THREE.NearestFilter,
                    this.uniforms.texture.value = H,
                    this.obj = this.createObj(),
                    y()
                }
                )
            }
            createObj() {
                return new window.THREE.Mesh(new window.THREE.PlaneBufferGeometry(2,2),new window.THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: `attribute vec3 position;
          attribute vec2 uv;

          varying vec2 vUv;

          void main(void) {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
                    fragmentShader: `precision highp float;

          uniform vec2 resolution;
          uniform vec2 imageResolution;
          uniform sampler2D texture;

          varying vec2 vUv;

          void main(void) {
            vec2 ratio = vec2(
                min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
                min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
              );

            vec2 uv = vec2(
                vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
              );
            gl_FragColor = texture2D(texture, uv);
          }
        `
                }))
            }
            resize() {
                this.uniforms.resolution.value.set(u.value.scrollWidth, u.value.scrollHeight)
            }
        }
        class q {
            constructor(g) {
                this.uniforms = {
                    time: {
                        type: "f",
                        value: 0
                    },
                    resolution: {
                        type: "v2",
                        value: new window.THREE.Vector2(u.value.scrollWidth,u.value.scrollHeight)
                    },
                    texture: {
                        type: "t",
                        value: g
                    }
                },
                this.obj = this.createObj()
            }
            createObj() {
                return new window.THREE.Mesh(new window.THREE.PlaneGeometry(2,2),new window.THREE.RawShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: `attribute vec3 position;
          attribute vec2 uv;
          
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
                    fragmentShader: `precision highp float;
        
          uniform float time;
          uniform vec2 resolution;
          uniform sampler2D texture;
          
          varying vec2 vUv;
          
          float random(vec2 c){
            return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
          }


          vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
          }

          vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
          }

          vec4 permute(vec4 x) {
               return mod289(((x*34.0)+1.0)*x);
          }

          vec4 taylorInvSqrt(vec4 r)
          {
            return 1.79284291400159 - 0.85373472095314 * r;
          }

          float snoise3(vec3 v)
            {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

          // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;

          // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //   x0 = x0 - 0.0 + 0.0 * C.xxx;
            //   x1 = x0 - i1  + 1.0 * C.xxx;
            //   x2 = x0 - i2  + 2.0 * C.xxx;
            //   x3 = x0 - 1.0 + 3.0 * C.xxx;
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

          // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                       i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

          // Gradients: 7x7 points over a square, mapped onto an octahedron.
          // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
            //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

          //Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

          // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                          dot(p2,x2), dot(p3,x3) ) );
            }
                    
          const float interval = 3.0;
          
          void main(void){
            float strength = smoothstep(interval * 0.5, interval, interval - mod(time, interval));
            vec2 shake = vec2(strength * 8.0 + 0.5) * vec2(
              random(vec2(time)) * 2.0 - 1.0,
              random(vec2(time * 2.0)) * 2.0 - 1.0
            ) / resolution;
          
            float y = vUv.y * resolution.y;
            float rgbWave = (
                snoise3(vec3(0.0, y * 0.01, time * 400.0)) * (2.0 + strength * 32.0)
                * snoise3(vec3(0.0, y * 0.02, time * 200.0)) * (1.0 + strength * 4.0)
                + step(0.9995, sin(y * 0.005 + time * 1.6)) * 12.0
                + step(0.9999, sin(y * 0.005 + time * 2.0)) * -18.0
              ) / resolution.x;
            float rgbDiff = (6.0 + sin(time * 500.0 + vUv.y * 40.0) * (20.0 * strength + 1.0)) / resolution.x;
            float rgbUvX = vUv.x + rgbWave;
            float r = texture2D(texture, vec2(rgbUvX + rgbDiff, vUv.y) + shake).r;
            float g = texture2D(texture, vec2(rgbUvX, vUv.y) + shake).g;
            float b = texture2D(texture, vec2(rgbUvX - rgbDiff, vUv.y) + shake).b;
          
            float whiteNoise = (random(vUv + mod(time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);
          
            float bnTime = floor(time * 20.0) * 200.0;
            float noiseX = step((snoise3(vec3(0.0, vUv.x * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
            float noiseY = step((snoise3(vec3(0.0, vUv.y * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
            float bnMask = noiseX * noiseY;
            float bnUvX = vUv.x + sin(bnTime) * 0.2 + rgbWave;
            float bnR = texture2D(texture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask;
            float bnG = texture2D(texture, vec2(bnUvX, vUv.y)).g * bnMask;
            float bnB = texture2D(texture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask;
            vec4 blockNoise = vec4(bnR, bnG, bnB, 1.0);
          
            float bnTime2 = floor(time * 25.0) * 300.0;
            float noiseX2 = step((snoise3(vec3(0.0, vUv.x * 2.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.5);
            float noiseY2 = step((snoise3(vec3(0.0, vUv.y * 8.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.3);
            float bnMask2 = noiseX2 * noiseY2;
            float bnR2 = texture2D(texture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask2;
            float bnG2 = texture2D(texture, vec2(bnUvX, vUv.y)).g * bnMask2;
            float bnB2 = texture2D(texture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask2;
            vec4 blockNoise2 = vec4(bnR2, bnG2, bnB2, 1.0);
          
            float waveNoise = (sin(vUv.y * 1200.0) + 1.0) / 2.0 * (0.15 + strength * 0.2);
          
            gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - bnMask - bnMask2) + (whiteNoise + blockNoise + blockNoise2 - waveNoise);
          }
        `
                }))
            }
            render(g) {
                this.uniforms.time.value += g
            }
            resize() {
                this.uniforms.resolution.value.set(u.value.scrollWidth, u.value.scrollHeight)
            }
        }
        function I() {
            te("re-cal-time-out")
        }
        return oe( () => {
            window.addEventListener("resize", I),
            setTimeout( () => {
                const D = new window.THREE.WebGLRenderTarget(u.value.scrollWidth,u.value.scrollHeight)
                  , g = new G
                  , y = new q(D.texture)
                  , U = new window.THREE.WebGLRenderer({
                    antialias: !1,
                    canvas: L.value
                })
                  , H = new window.THREE.Scene
                  , X = new window.THREE.Scene
                  , F = new window.THREE.OrthographicCamera(-1,1,1,-1,0,1)
                  , z = new window.THREE.PerspectiveCamera(45,u.value.scrollWidth / u.value.scrollHeight,1,1e4)
                  , $ = new window.THREE.Clock
                  , Y = () => {
                    z.aspect = u.value.scrollWidth / u.value.scrollHeight,
                    F.aspect = u.value.scrollWidth / u.value.scrollHeight,
                    z.updateProjectionMatrix(),
                    z.updateProjectionMatrix(),
                    g.resize(),
                    y.resize(),
                    D.setSize(u.value.scrollWidth, u.value.scrollHeight),
                    U.setSize(u.value.scrollWidth, u.value.scrollHeight)
                }
                  , J = () => {
                    const r = $.getDelta();
                    U.render(X, z, D),
                    y.render(r),
                    U.render(H, F)
                }
                  , n = () => {
                    J(),
                    requestAnimationFrame(n)
                }
                  , e = r => {
                    U.setClearColor(1118481, 1),
                    z.position.set(0, 0, 0),
                    z.lookAt(new window.THREE.Vector3(u.value.scrollWidth,u.value.scrollHeight,0)),
                    g.init(r, () => {
                        X.add(g.obj),
                        H.add(y.obj)
                    }
                    ),
                    n()
                }
                ;
                function o() {
                    he.toPng(u.value, {
                        width: u.value.scrollWidth,
                        height: u.value.scrollHeight
                    }).then(function(r) {
                        const l = new Image;
                        l.src = r,
                        l.onload = function() {
                            const i = document.createElement("canvas");
                            i.width = u.value.scrollWidth,
                            i.height = u.value.scrollHeight;
                            const a = i.getContext("2d")
                              , s = l.width / l.height
                              , d = i.width / s
                              , w = (i.height - d) / 2;
                            a.drawImage(l, 0, w, i.width, d),
                            window.cancelAnimationFrame(n),
                            e(i.toDataURL())
                        }
                    })
                }
                Y(),
                o(),
                j.value = !0
            }
            , 500)
        }
        ),
        ie( () => {
            window.removeEventListener("resize", I)
        }
        ),
        (D, g) => (ae(),
        se("div", {
            class: ce(["fixed inset-0 z-[1500] duration-500", {
                "pointer-events-none opacity-0": !V(j),
                "pointer-events-auto cursor-pointer opacity-100": V(j)
            }]),
            onClick: g[0] || (g[0] = (...y) => I && I(...y))
        }, [S("div", me, [S("canvas", {
            ref_key: "effectCanvas",
            ref: L,
            class: ""
        }, null, 512)]), S("div", {
            id: "myDom",
            ref_key: "myDom",
            ref: u,
            class: "absolute left-0 top-0 h-full w-full overflow-hidden bg-primary"
        }, [S("div", de, [S("div", ge, [S("h3", pe, le(V(O)), 1), xe]), S("div", {
            class: "timeout | zh-text-light text-white",
            innerHTML: V(P)
        }, null, 8, ye)])], 512)], 2))
    }
};
export {Ee as default};
