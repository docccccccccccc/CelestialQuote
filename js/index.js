function getOptions() {
    return {
        content: {
            celname: document.getElementById("option-celname").value,
            celquote: document.getElementById("option-celquote").value,
        },
        style: {
            celcolor: document.getElementById("option-celcolor").value,
            celchar: document.getElementById("option-celchar").value,
            celcharbg: document.getElementById("option-celcharbg").checked,
            celimguri: document.getElementById("celquote-bg-img").src
        },
        button: {
            celinner: document.getElementById("option-celinner").checked,
            outer: {
                celupbtn: document.getElementById("option-celupbtn").checked,
                celdownbtn: document.getElementById("option-celdownbtn").checked,
                celleftbtn: document.getElementById("option-celleftbtn").checked,
                celrightbtn: document.getElementById("option-celrightbtn").checked,
            },
            inner: {
                celokbtn: document.getElementById("option-celokbtn").checked,
                celleftbtninner: document.getElementById("option-celleftbtninner").checked,
                celrightbtninner: document.getElementById("option-celrightbtninner").checked
            }
        }
    };
}

// 切换背景使用字符还是图片
function switchBgUse(isChar) {
    document.getElementById("celimg").style.display = isChar ? "none" : "block";
    document.getElementById("celchar").style.display = isChar ? "block" : "none";
    document.getElementById("celcharpreset").style.display = isChar ? "inline-flex" : "none";
}

// 对话框背景
const CELCHARBG_ELEMENT = document.querySelector("#option-celcharbg");
CELCHARBG_ELEMENT.addEventListener("input", function () {
    let usecharasbg = CELCHARBG_ELEMENT.checked;
    switchBgUse(usecharasbg);
})

// 按钮状态处理

function switchBtnMode(isInner) {
    document.getElementById("celinner").style.display = isInner ? "flex" : "none";
    document.getElementById("celouter").style.display = isInner ? "none" : "flex";
}

const CELBTNMODE_ELEMENT = document.querySelector("#option-celinner");
CELBTNMODE_ELEMENT.addEventListener("input", function () {
    let isInner = CELBTNMODE_ELEMENT.checked;
    switchBtnMode(isInner);
})

// 按钮文字暂时变化

function changeBtnText(btn, text1, text2) {
    btn.textContent = text1;
    setTimeout(() => {
        btn.textContent = text2;
    }, 2000);
}

// 设置导出
function exportOptions() {
    let options = getOptions();
    navigator.clipboard.writeText(`CelestialQuoteOptionDataFormat${Base64.encode(JSON.stringify(options))}EndOfCelestialQuoteOptionData`)
        .then(() => {
            changeBtnText(document.getElementById("export"), "已复制！", "将配置复制到剪贴板");
        })
        .catch(e => console.error(e)); // 跟 AD 学的
}

// 导出为文件

function exportOptionsAsFile() {
    let today = new Date();
    let optionsText = `CelestialQuoteOptionDataFormat${Base64.encode(JSON.stringify(getOptions()))}EndOfCelestialQuoteOptionData`;
    const blob = new Blob([optionsText], { type: 'text/plain' });

    // 创建一个下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `CelQuoteData_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() + 1}_${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}.txt`;

    // 触发点击事件
    downloadLink.click();

    // 释放URL对象
    setTimeout(() => {
        URL.revokeObjectURL(downloadLink.href);
    }, 100);
}

// 设置导入

function importOptions(optionsText) {
    function optionsApply(t) {
        let options;
        if (!(t.slice(0, 30) === "CelestialQuoteOptionDataFormat" && t.slice(-29) === "EndOfCelestialQuoteOptionData")) {
            if(!optionsText) changeBtnText(document.getElementById("import"), "数据格式错误", "从剪贴板导入配置（会直接读取！）");
            return;
        }
        try {
            options = JSON.parse(Base64.decode(t.slice(30, -29)));
        } catch (e) {
            if(!optionsText) changeBtnText(document.getElementById("import"), "无法解析数据", "从剪贴板导入配置（会直接读取！）");
            return;
        }
        document.getElementById("option-celname").value = options.content.celname;
        document.getElementById("option-celquote").value = options.content.celquote;
        document.getElementById("option-celcolor").value = options.style.celcolor;
        document.getElementById("option-celchar").value = options.style.celchar;
        document.getElementById("option-celcharbg").checked = options.style.celcharbg;
        document.getElementById("option-celinner").checked = options.button.celinner;
        document.getElementById("option-celupbtn").checked = options.button.outer.celupbtn;
        document.getElementById("option-celdownbtn").checked = options.button.outer.celdownbtn;
        document.getElementById("option-celleftbtn").checked = options.button.outer.celleftbtn;
        document.getElementById("option-celrightbtn").checked = options.button.outer.celrightbtn;
        document.getElementById("option-celokbtn").checked = options.button.inner.celokbtn;
        document.getElementById("option-celleftbtninner").checked = options.button.inner.celleftbtninner;
        document.getElementById("option-celrightbtninner").checked = options.button.inner.celrightbtninner;
        document.getElementById("celquote-bg-img").src = options.style.celimguri;
        switchBgUse(options.style.celcharbg);
        switchBtnMode(options.button.celinner);
    }
    if (optionsText === undefined) {
        navigator.clipboard.readText()
            .then(optionsText => optionsApply(optionsText))
            .catch(e => console.error(e));
    } else {
        optionsApply(optionsText);
    }
}



// 从文件导入
document.getElementById("import-from-file-input").addEventListener("change", function (event) {
    const file = event.target.files[0];
    let fileName = file.name;
    if (fileName.lastIndexOf('.') <= 0 || fileName.substring(fileName.lastIndexOf('.') + 1) !== "txt") return;
    if( file){
        var reader = new FileReader();
        reader.onload = function (e) {
            importOptions(e.target.result);
        };
        reader.readAsText(file);
    }
})

function importOptionsFromFile(){
    document.getElementById("import-from-file-input").click();
}
// 大背景点击

document.getElementById("celquote-container").addEventListener("click", function () {
    document.getElementById("celquote-container").style.display = "none";
})

// 生成

function generate() {

    let options = {
        content: {
            celname: document.getElementById("option-celname").value,
            celquote: document.getElementById("option-celquote").value,
        },
        style: {
            celcolor: document.getElementById("option-celcolor").value,
            celchar: document.getElementById("option-celchar").value,
            celcharbg: document.getElementById("option-celcharbg").checked,
        },
        button: {
            celinner: document.getElementById("option-celinner").checked,
            outer: {
                celupbtn: document.getElementById("option-celupbtn").checked,
                celdownbtn: document.getElementById("option-celdownbtn").checked,
                celleftbtn: document.getElementById("option-celleftbtn").checked,
                celrightbtn: document.getElementById("option-celrightbtn").checked,
            },
            inner: {
                celokbtn: document.getElementById("option-celokbtn").checked,
                celleftbtninner: document.getElementById("option-celleftbtninner").checked,
                celrightbtninner: document.getElementById("option-celrightbtninner").checked
            }
        }
    };
    function disableBtnHandler(elementID, inner, option) {
        let element = document.getElementById(elementID);
        if (options.button[inner ? "inner" : "outer"][option]) element.classList.remove("celctrl-disabled");
        else element.classList.add("celctrl-disabled");
    }
    if (!/^#[0-9a-fA-f]{6}$/.test(options.style.celcolor)) {
        alert("颜色代码格式错误（要求形如 #ab1244，# 后带 6 位 0 ~ 9 的字符或者 a ~ f 的字符，对大小写无要求）");
        return;
    }
    // 内容
    document.getElementById("celname").textContent = options.content.celname;
    document.getElementById("celquote").textContent = options.content.celquote;
    // 样式

    document.querySelectorAll(".custom-color").forEach(element => {
        element.style.color = options.style.celcolor;
    })
    // document.getElementById("celquote-main").style.color = options.style.celcolor;

    document.getElementById("celquote-bg-text").textContent = options.style.celchar;
    document.getElementById("celquote-bg-text").style.display = options.style.celcharbg ? "block" : "none";
    document.getElementById("celquote-bg-img").style.display = options.style.celcharbg ? "none" : "block";
    document.getElementById("option-celcharbg").checked = options.style.celcharbg;
    // 按钮显示
    document.getElementById("celquote-close").style.display = options.button.celinner ? "none" : "block";
    document.getElementById("celctrl-outerupbtn").style.display = options.button.celinner ? "none" : "block";
    document.getElementById("celctrl-outerdownbtn").style.display = options.button.celinner ? "none" : "block";
    document.getElementById("celctrl-outerleftbtn").style.display = options.button.celinner ? "none" : "block";
    document.getElementById("celctrl-outerrightbtn").style.display = options.button.celinner ? "none" : "block";
    document.getElementById("celctrl-leftbtn").style.display = (options.button.celinner && options.button.inner.celleftbtninner) ? "block" : "none";
    document.getElementById("celctrl-rightbtn").style.display = (options.button.celinner && options.button.inner.celrightbtninner) ? "block" : "none";
    document.getElementById("celctrl-okbtn").style.display = (options.button.celinner && options.button.inner.celokbtn) ? "block" : "none";
    // 按钮的启用和禁用
    disableBtnHandler("celctrl-outerupbtn", false, "celupbtn")
    disableBtnHandler("celctrl-outerdownbtn", false, "celdownbtn")
    disableBtnHandler("celctrl-outerleftbtn", false, "celleftbtn")
    disableBtnHandler("celctrl-outerrightbtn", false, "celrightbtn")
    document.getElementById("celquote-container").style.display = "block"
    // 超市 QqQe308 喵~
    // CelestialQuoteOptionDataFormateyJjb250ZW50Ijp7ImNlbG5hbWUiOiLnibnolb7ojo4iLCJjZWxxdW90ZSI6IuaIkeS7rOS4gOebtOWcqOinguWvn+S9oOOAgiJ9LCJzdHlsZSI6eyJjZWxjb2xvciI6IiM1MTUxRUMiLCJjZWxpbWciOiIiLCJjZWxjaGFyIjoiz54iLCJjZWxjaGFyYmciOnRydWV9LCJidXR0b24iOnsiY2VsaW5uZXIiOmZhbHNlLCJvdXRlciI6eyJjZWx1cGJ0biI6dHJ1ZSwiY2VsZG93bmJ0biI6dHJ1ZSwiY2VsbGVmdGJ0biI6ZmFsc2UsImNlbHJpZ2h0YnRuIjpmYWxzZX0sImlubmVyIjp7ImNlbG9rYnRuIjpmYWxzZSwiY2VsbGVmdGJ0bmlubmVyIjpmYWxzZSwiY2VscmlnaHRidG5pbm5lciI6ZmFsc2V9fX0=EndOfCelestialQuoteOptionData
}

// 初始化

const ACCEPTED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'webp'];

function init() {
    switchBgUse(true);
    switchBtnMode(false);
    document.getElementById('option-celimg').addEventListener('change', function (event) {
        const file = event.target.files[0];
        let fileName = file.name;
        if (fileName.lastIndexOf('.') <= 0 || !ACCEPTED_FILE_TYPES.includes(fileName.substring(fileName.lastIndexOf('.') + 1))) return;
        const previewImg = document.getElementById('celquote-bg-img');
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

document.addEventListener("DOMContentLoaded", init());