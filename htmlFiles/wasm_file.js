var importObject = {
    imports: { imported_func: arg => console.log(arg) }
  };

let wasm;

export async function init()
{
    let r = await fetch('wasm_file.wasm');
    let bytes = await r.arrayBuffer();
    let res = await WebAssembly.instantiate(bytes, importObject);
    wasm = res.instance.exports;
}

export async function calc(place)
{
    return wasm.calc(place);
}
