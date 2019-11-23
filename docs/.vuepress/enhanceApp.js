export default ({
    Vue,
    options,
    router, 
    siteData
}) => {
    var node = document.createElement("script");
    node.setAttribute("type", "text/javascript");
    node.setAttribute("src", "http://tajs.qq.com/stats?sId=65846734");
    node.setAttribute("charset", "UTF-8");
    document.head.appendChild(node);
}