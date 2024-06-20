## 重點
- 需要有 `OpenSSL` 或者 `strongswan-pki` 套件，否則無法簽發憑證。
	- 下方大部份的指令都會提供兩種套件的指令用法
	- OpenSSL 指令為開頭 `openssl`
	- strongswan-pki 指令為開頭 `pki`
- 根憑證用於簽發其它終端憑證。
- 根憑證推薦自簽。網路上的免費憑證大部份也不能直接被終端信任（如 Let's Encrypt 等）。
- 憑證製作過程中會有很多檔案的產生，建議開一個資料夾保存，並且該資料夾的權限要加以控管，因為裡面會有私鑰等機密資訊。
- 憑證的保存有 PEM 和 DER 兩種格式，這邊推薦 PEM，否則有些系統會有相容性問題。
- 憑證的算法有非常多的選擇，而常用的 ED25519 在這裡不太建議，因為在 Android 和 Windows 上面都可能會遇到問題，這邊建議使用 RSA。
- 每一個憑證本質上都是公鑰加上一些資訊，而公鑰又需要先有私鑰。
	- 生成私鑰
		- OpenSSL
		```bash
		openssl genpkey -outform PEM -quiet -aes256 \
		-algorithm rsa -pkeyopt rsa_keygen_bits:4096 \ 
		-out private.key
		```
		- strongswan-pki 
		```bash
		pki --gen --type rsa --size 4096 --outform pem > private.key
		```
- 終端憑證可以直接簽也可以透過憑證請求。

## 根憑證
- 根憑證一定要加密，因此推薦使用 `OpenSSL` 生成私鑰。
- 範例：
	- 自簽憑證
		- 一般來說根憑證天數都會多一天，下方為十年
		- OpenSSL
			- 憑證資訊可以使用 `-subj /C=國家/O=組織名/CN=域名或其它識別代號/` 指定。如果不指定則會提供互動介面來輸入資訊。
			```bash
			openssl req -x509 -outform PEM -days 3650 \
			-key ca.key -out ca.crt
			```
		- strongswan-pki
			```bash
			pki --self --type priv --outform pem --lifetime 3650 \
			--dn "C=國家, O=組織名, CN=域名或其它識別代號" \
			--in ca.key > ca.crt
			```

## 伺服器憑證
- 伺服器憑證有比較多的注意事項，因為每個系統都有不同的需求。 
- 識別名稱在伺服器端非常重要，CN 一定要設成域名，否則在身份驗證時會有錯誤。
	- 如果沒有申請域名則替換成 IP。
	- Android 終端需要特定額外設定 sans
- Windows 需要額外加入憑證用途。
- 範例：
	- 