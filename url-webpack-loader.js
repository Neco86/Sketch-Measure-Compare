
module.exports = function(source){
    const regex = /export\s+default\s+([\s\S]*);/;
    if (/\/url\/.*\.css$/.test(this.resourcePath)) {
        return source.replace(regex, `export default URL.createObjectURL(new Blob([${source.match(regex)[1]}], { type: 'text/css' }))`);
    }
    if (/\/url\/.*\.js$/.test(this.resourcePath)) {
        return source.replace(regex, `export default URL.createObjectURL(new Blob(['(' + ${source.match(regex)[1]}.toString() + ')()'], { type: 'text/javascript' }))`);
    }
    if (/\/url\/.*\.html$/.test(this.resourcePath)) {
        return source.replace(regex, `export default URL.createObjectURL(new Blob([${source.match(regex)[1]}], { type: 'text/html' }))`);
    }
    return source;
}