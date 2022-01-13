const UniqueId = () =>{
    const s4 = () => Math.floor((1 + Math.random()) * 0x1000).toString()
    return s4()
}
const UniqueName = () =>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
export {
    UniqueId,
    UniqueName
}