mod http_web_server_handler;

use std::net::TcpListener;
use std::thread;
use std::sync::Arc;

pub struct HttpWebServer
{
    listener: TcpListener,
    handler: Arc<http_web_server_handler::HttpWebServerHandler>
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
    /// let http_web_server = HttpWebServer::new("127.0.0.1".to_string(), 8080); 
    /// ```
    pub fn new(ip: String, port: i32) -> HttpWebServer 
    {
        let address = format!("{}:{}", ip, port);

        HttpWebServer{ listener: TcpListener::bind(address).unwrap(), handler: Arc::new(http_web_server_handler::HttpWebServerHandler::new())}
    }

    /// Listens for incoming clients forever
    /// 
    /// # Example
    /// 
    /// ```
    /// // Set up a server on localhost with port 8080
    /// let http_web_server = HttpWebServer::new("127.0.0.1".to_string(), 8080); 
    /// 
    /// // Will now listen forever for incoming clients.
    /// http_web_server.listen();
    /// 
    /// ```
    pub fn listen(&self) 
    {
        for stream in self.listener.incoming()
        {
            let local_self = self.handler.clone();

            let _ = thread::spawn(move || {
                local_self.handle_client(stream.unwrap());
            });
        }    
    }
}