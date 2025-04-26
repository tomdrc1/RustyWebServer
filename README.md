# Rusty Web Server

This is a webserver that I've written from scratch in Rust. It handles HTTP parsing and currently only supports GET requests, everything else will be sent to an API server (that has to be setup separately) if it has the correct API path requirements `"URL/API/<api_call>"`. This is an old project of mine, and I'm sure that there are many things that could be improved as well as the server being vulnerable to exploits.

The server will serve all of the files that you have inside of the `htmlFiles` directory, currently you can find there a template to a forum website I've written.

Finally, the IP and port are hardcoded inside of the `main.rs` file. This is a bad practice and I should take it out to a .env file, but the last time I touched this project was 6 years ago at the time I'm writing this README.

## Build

```
cd rustywebserver
cargo build --release
cargo run
```
