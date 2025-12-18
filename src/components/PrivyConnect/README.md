### Cài đặt UI package (tùy chọn, nếu dùng giao diện từ Orderly)

```bash
npm install @orderly.network/ui
```

Trong `./layout.tsx` (hoặc `_app.tsx`), import CSS:

```ts
import '@orderly.network/ui/dist/styles.css';
```

### Cấu trúc bọc provider

Toàn bộ app (hoặc phần cần dùng ví) nên được bọc bởi `WhatWagmiProvider`:

```tsx
<WhatWagmiProvider>
  {children}
</WhatWagmiProvider>
```

`WhatWagmiProvider` hiện đang:
- Bọc app bằng `PrivyProvider` (auth + ví).
- Khởi tạo `WagmiProvider` với chain `base`.
- Render thêm `ModalPrivyConnect` để chọn ví / login.

### Mở modal kết nối ví (Privy + wallet)

Ở bất kỳ nơi nào trong client code, có thể gọi:

```ts
window.openModalPrivyConnect();
```

Lệnh trên sẽ mở `ModalPrivyConnect` để:
- Đăng nhập bằng Email / Google / Twitter.
- Kết nối ví EVM (MetaMask, WalletConnect, Brave, Binance, Privy wallet, ...).

### Mở modal chọn ví (wallet list riêng)

Ngoài `openModalPrivyConnect`, bạn có thể mở modal danh sách ví riêng (nếu được implement trong code) bằng:

```ts
window.openModalPrivyWallet();
```

Tuỳ vào implementation, modal này có thể hiển thị danh sách ví EVM / Solana cụ thể để chọn nhanh.