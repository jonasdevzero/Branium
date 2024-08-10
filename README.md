<div align="center">
  <h1>Branium</h1>
  <p>WebChat With E2E</p>
</div>

## About

Branium is more than just a regular chat, it is a robust and secure communication platform, designed to serve users who are aware of the security and privacy of their conversations.

## 🔥 Main Features

✨ End-to-End Encryption: Your text messages, images, videos, files and audios are protected by a solid layer of encryption, ensuring that only you and the recipient can access the content.

✨ Microservices Structure: Branium is built on a microservices architecture, all of them with secure connections using TLS (Transport Layer Security), providing more security and fluidity to the end user.

✨ Cutting-Edge Technologies: Branium's microservices were developed using NodeJS with TypeScript under the Clean Arch architecture, ensuring efficiency, maintainability and scalability. Furthermore, the frontend was built using NextJS 14 and TypeScript, ensuring an elegant and fluid user interface.

## 🌩 Main Challenge

Develop asymmetric encryption that works for the web and is secure enough, why? Because users can access it from different machines. But what impact does this have? On the private key used to encrypt the messages.

## 🎯 Features

- ✅ End-to-end encryption
- ✅ Private chat
- ✅ Full messages (text, image, audio, video, documents and replies)
- ✅ Voice/video calling
- 🚧 Groups

## 🎥 Video Demo

[![DEMO](https://img.youtube.com/vi/KeWRhSol1oY/0.jpg)](https://www.youtube.com/watch?v=KeWRhSol1oY)

## Achitecture

This project consists of 3 micro services:

- [Athentication](https://github.com/jonasdevzero/BraniumAuthentication)
- [Keys](https://github.com/jonasdevzero/BraniumKeys)
- [Messages](https://github.com/jonasdevzero/BraniumMessages)
