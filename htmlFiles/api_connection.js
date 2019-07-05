var importObject = {
    imports: { imported_func: arg => console.log(arg) }
  };

let wasm;

export async function init()
{
    let r = await fetch('api_connection.wasm');
    let bytes = await r.arrayBuffer();
    let res = await WebAssembly.instantiate(bytes, importObject);
    wasm = res.instance.exports;
}

export async function get_user(username)
{
    return wasm.get_user(username);
}
