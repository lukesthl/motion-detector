#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use local_ip_address::local_ip;
use tauri_plugin_store::PluginBuilder;
// use std::net::{Ipv4Addr, UdpSocket, SocketAddr};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_local_ip() -> String {
    let my_local_ip = local_ip().unwrap();
    format!("{}", my_local_ip)
}

// #[tauri::command]
// async fn getNetworkDevices() -> Result<String> {
//     const MULTICAST_ADDR: &str = "239.255.255.250:4000";
//     let socket =  create_socket().await?;
//     let payload = MULTICAST_ADDR;
    
//     let sentAddr: SocketAddr = MULTICAST_ADDR.parse().unwrap();
//     socket.send_to(payload.as_bytes(), &sentAddr).await
// }

// async fn create_socket() -> Result<UdpSocket, std::io::Error> {
//     const LOCAL_ADDR: &str = "0.0.0.0:0";
//     let addr: SocketAddr = LOCAL_ADDR.parse().unwrap();
//     UdpSocket::bind(addr).await
// }

fn main() {
    tauri::Builder::default()
    .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![get_local_ip, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    
}
