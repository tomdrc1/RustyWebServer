use std::net::{TcpListener, TcpStream};
use std::io::prelude::*;
use std::fs;

const API_IP: &str = "127.0.0.1";
const API_PORT: u16 = 8081;
const BUFFER_SIZE: usize = 1024;

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
    /// let http_web_server = HttpWebServer::new("127.0.0.1".to_string(), 8080); 
    /// 
    /// 
    /// ```
    pub fn new(ip: String, port: i32) -> HttpWebServer 
    {
        let address = format!("{}:{}", ip, port);

        HttpWebServer{ listener: TcpListener::bind(address).unwrap()}
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
            self.handle_client(stream.unwrap());
        }    
    }

    /// Will handle the client. Private function to help the code be cleaner
    fn handle_client(&self, mut stream: TcpStream)
    {
        let mut buffer = [0; BUFFER_SIZE];
        stream.read(&mut buffer).unwrap();

        let msg = String::from_utf8_lossy(&buffer[..]).to_string();
        
        if self.is_api(&msg)
        {
            self.send_to_api(msg, &mut stream);
        }
        else if msg.starts_with("GET")
        {
            self.handle_get_request(msg, &mut stream);
        }
    }

    /// This function will check if the message the server has gotten is actually ment for the API server and not the webserver
    /// 
    /// # Argumnets
    /// 
    /// * `msg_from_client` - A string refrence that holds the message the client has sent
    /// 
    /// # Example
    /// ```
    /// if self.is_api(&msg)
    /// {
    ///     self.send_to_api(msg, &mut stream);
    /// }
    /// ```
    fn is_api(&self, msg_from_client: &String) -> bool
    {
        let parsed_msg: Vec<&str> = msg_from_client.split(" ").collect();

        if parsed_msg.len() < 2
        {
            return false;
        }

        let parsed_request: Vec<&str> = parsed_msg[1].split("/").collect();

        parsed_request[1] == "API"
    }

    /// Will send the message to the api and will return the answer from the api to the user
    /// 
    /// # Argumnets
    /// 
    /// * `msg_from_client` - A string that contains the message from the client
    /// * `client_stream` - A mutable refrence of a TcpStream (This is the client's stream)
    /// 
    /// # Example
    /// ```
    /// if self.is_api(&msg)
    /// {
    ///     self.send_to_api(msg, &mut stream);
    /// }
    /// ```
    fn send_to_api(&self, msg_from_client: String, client_stream: &mut TcpStream)
    {
        let api_address = format!("{}:{}", API_IP, API_PORT);
        let mut api_connection = TcpStream::connect(api_address).unwrap();

        api_connection.write(msg_from_client.as_bytes()).unwrap();
        api_connection.flush().unwrap();
        
        let mut buffer = [0; BUFFER_SIZE];
        api_connection.read(&mut buffer).unwrap();

        let mut msg = String::from_utf8_lossy(&buffer[..]).to_string();
        msg = msg.trim_matches(char::from(0)).to_string(); // Get rid of NULL

        client_stream.write(msg.as_bytes()).unwrap();
        client_stream.flush().unwrap();
    }   

    /// Will handle the request if it is an HTTP GET request. Private function to help the code be cleaner
    /// 
    /// # Arguments
    /// * `msg_from_client` - A string that holds the message the client has sent.
    /// * `stream` - A mutable refrence of a TcpStream. So we will be able to send the client the message and after we're done with the function we will return the TcpStream we borrowed.
    /// 
    /// # Example
    /// 
    /// ```
    /// let mut buffer = [0; 512];
    /// stream.read(&mut buffer).unwrap();
    /// 
    /// let msg = String::from_utf8_lossy(&buffer[..]);
    /// if msg.starts_with("GET")
    /// {
    ///     self.handle_get_request(msg.to_string(), &mut stream);  
    /// }
    /// ```
    fn handle_get_request(&self, msg_from_client: String, stream: &mut TcpStream)
    {
        let file_name = self.get_file_name(msg_from_client);
        let full_response = self.get_response_message_u8(file_name);

        stream.write(&full_response[..]).unwrap();
        stream.flush().unwrap();
    }

    /// Returns the file name from the msg to the client.
    /// 
    /// # Arguments
    /// * `msg_from_client` - A string that holds the message a client has sent
    fn get_file_name(&self, msg_from_client: String) -> String
    {
        let mut parsed_msg: Vec<&str> = msg_from_client.split(" ").collect();

        parsed_msg = parsed_msg[1].split("?").collect(); // Incase someone tries to mess up the site with data passed through ?
        let mut file_name = parsed_msg[0].to_string();

        if file_name == "/"
        {
            return "index.html".to_string();
        }
        else if !file_name.contains(".")
        {
            file_name += ".html";
        }
        file_name.replace("/", "")
    }

    /// Returns the full response message with the headers and the file data. The data will be returned in a Byte vector format.
    /// 
    /// # Arguments 
    /// * `file_name` - A string that holds the file name
    /// 
    /// # Example
    /// ```
    /// let full_response = self.get_response_message_u8(file_name);
    /// // send the response to the client, as the `write` function only passes a byte array refrence we make the array into that.
    /// stream.write(&full_response[..]).unwrap();
    /// stream.flush().unwrap();
    /// ```
    fn get_response_message_u8(&self, file_name: String) -> Vec<u8>
    {
        // Set 200 Ok as deafult if there is an error (usually a not found error) change response to error headers.
        let mut response = "HTTP/1.1 200 OK\r\n".to_string().into_bytes();
        let mut file_data = match fs::read(format!("htmlFiles\\{}", file_name))
        {
            Ok(file) => file,
            Err(_) =>
            {
                response = "HTTP/1.1 404 NOT FOUND\r\n".to_string().into_bytes();
                fs::read("htmlFiles\\404_not_found.html").unwrap()
            }
        };

        if file_name.ends_with(".js")
        {
            response.append(&mut "Content-type: application/javascript\r\n\r\n".to_string().into_bytes());
        }
        else
        {
            response.append(&mut "\r\n".to_string().into_bytes());
        }

        // Append data to the headers
        response.append(&mut file_data);

        response
    }
}