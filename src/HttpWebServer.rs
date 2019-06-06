use std::net::{TcpListener, TcpStream};
use std::io::prelude::*;

pub struct HttpWebServer
{
    listener: TcpListener
}

impl HttpWebServer
{
    /// Returns a new HttpWebServer instance 
    ///
    /// # Arguments
    ///
    /// * `ip` - A string that holds the ip
    /// * `port` - A int that holds the requested port
    /// 
    /// # Example
    /// 
    /// ```
    /// // Set up a server on localhost with port 8080
    /// let HttpWebServerInstance = HttpWebServer::new("127.0.0.1", 8080); 
    /// 
    /// 
    /// ```
    pub fn new(ip: String, port: i32) -> HttpWebServer
    {
        let adress = format!("{}:{}", ip, port);
        HttpWebServer{TcpListener::bind(adress).unwrap()};
    }
}