mod http_web_server;

fn main()
{
    let web_server = http_web_server::HttpWebServer::new("127.0.0.1".to_string(), 35058);

    web_server.listen();
}   