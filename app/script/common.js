function fill0(number) {
    return number < 10 ? "0" + number : number
}

export default {
    getFormattedDate: function(date) {
        return date.getFullYear() + "-" + fill0(date.getMonth() + 1) + "-" + fill0(date.getDate())
    },
    printStyle: function () {
        return "<style>table{width:100%;font-family: verdana,arial,sans-serif;\n" +
            "    font-size:11px;\n" +
            "    color:#333333;\n" +
            "    border-width: 1px;\n" +
            "    border-color: #666666;\n" +
            "    border-collapse: collapse;} th{border-width: 1px;\n" +
            "    padding: 8px;\n" +
            "    border-style: solid;\n" +
            "    border-color: #666666;\n" +
            "    background-color: #dedede;} td{border-width: 1px;\n" +
            "    padding: 8px;\n" +
            "    border-style: solid;\n" +
            "    border-color: #666666;\n" +
            "    background-color: #ffffff;}</style>";
    }
}
