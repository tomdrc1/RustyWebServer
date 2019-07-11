mod http_web_server;

fn main()
{
    let web_server = http_web_server::HttpWebServer::new("192.168.1.110".to_string(), 35058);

    web_server.listen();
}   