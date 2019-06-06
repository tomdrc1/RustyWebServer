use std::net::{TcpListener, TcpStream};
use std::io::prelude::*;
use std::fs;

fn main()
{
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();

    for stream in listener.incoming()
    {
        handle_client(stream.unwrap());
    }
}


fn handle_client(mut stream: TcpStream)
{
    let mut buffer = [0; 512];
    stream.read(&mut buffer).unwrap();

    let file_data = fs::read_to_string("C:\\Users\\tomdr\\Desktop\\Code\\Rust\\webserver\\src\\test.html").unwrap();
    let response = format!("HTTP/1.1 200 OK\r\n\r\n{}", file_data);

    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}