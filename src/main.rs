mod HttpWebServer;

fn main()
{
    let web_server = HttpWebServer::HttpWebServer::new("127.0.0.1".to_string(), 8080);

    web_server.listen();
}