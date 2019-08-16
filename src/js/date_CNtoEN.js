//date中文轉英文的函數
function date_CNtoEN(value) {
    let cn = ["日", "月", "年"];
    let en = ["%d", "%m", "%Y"];
    let tmp = "";
    for (let i in cn) {
        value == cn[i] ? (tmp = en[i]) : "";
        //tmp = (value == cn[i]) ? en[i] : tmp;
    }
    return tmp;
}

export default date_CNtoEN;