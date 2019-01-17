import { observable, observe, computed } from "mobx";
import { Album } from "./album-data";

export interface DropboxFile {
	name: string;
	path_lower: string;
	id: string;
	size: number;
	client_modified: string;
}

class MainData {
	@observable loading: boolean = false;
	@observable validToken: boolean = false;
	@observable validFile: boolean = false;
	@observable path: string[] = ["", ""];

	@observable shouldValidate = false;

	@observable currentlyOpenAlbum: Album = new Album();

	@observable availableAlbums: DropboxFile[] = [];

	@observable openedAlbum: boolean = false;

	@computed get accessToken() {
		return this.path[0];
	}

	@computed get fileName() {
		return decodeURI(this.path[1]);
	}

	async validateToken() {
		if (!this.accessToken) {
			return (this.validToken = false);
		}
		try {
			await this.listAlbums();
			return (this.validToken = true);
		} catch (e) {
			return (this.validToken = false);
		}
	}

	async validateFile() {
		if (!this.validToken) {
			return (this.validFile = false);
		}

		if (!this.fileName) {
			return (this.validFile = false);
		}

		// communicating with apexo
		if (this.fileName.startsWith("@id:")) {
			const pattern = /@id:(.*)@title:(.*)/.exec(this.fileName) || [];
			const id = pattern[1];
			const existingAlbum = this.availableAlbums.find(
				album => album.path_lower.indexOf(id) !== -1
			);
			if (!existingAlbum) {
				const newAlbum = new Album();
				newAlbum._id = id;
				newAlbum.title = pattern[2];
				this.currentlyOpenAlbum = newAlbum;
				this.openedAlbum = true;
				this.setHash(this.accessToken, newAlbum.fileName);
				return (this.validFile = true) && (this.openedAlbum = true);
			} else {
				const album = await this.dlAlbum(existingAlbum.name);
				this.currentlyOpenAlbum = album;
				this.setHash(this.accessToken, album.fileName);
				return (this.validFile = true) && (this.openedAlbum = true);
			}
		}

		try {
			const fileID = this.fileName.split("__")[0];
			const existingAlbum = this.availableAlbums.find(album =>
				album.name.startsWith(fileID)
			) as DropboxFile;
			const album = await this.dlAlbum(existingAlbum.name);
			this.currentlyOpenAlbum = album;
			return (this.validFile = true) && (this.openedAlbum = true);
		} catch (e) {
			return (this.validFile = false);
		}
	}

	listAlbums() {
		this.loading = true;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.onload = () => {
				this.loading = false;
				if (xhr.status === 200) {
					this.availableAlbums = JSON.parse(xhr.response).entries;
					resolve();
				} else {
					return reject(xhr.response || "Unable to list files");
				}
			};

			xhr.onerror = () => (this.loading = false);

			xhr.open("POST", "https://api.dropboxapi.com/2/files/list_folder");
			xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(
				JSON.stringify({
					path: "",
					recursive: false,
					include_media_info: false,
					include_deleted: false,
					include_has_explicit_shared_members: false
				})
			);
		});
	}

	dlAlbum(fileName: string): Promise<Album> {
		this.loading = true;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onload = () => {
				this.loading = false;
				if (xhr.status === 200) {
					const data = new Uint8Array(xhr.response).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					);
					resolve(
						new Album(JSON.parse(data.replace(/orthograph:/, "")))
					);
				} else {
					reject(xhr.response);
				}
			};
			xhr.onerror = () => (this.loading = false);

			xhr.open("POST", "https://content.dropboxapi.com/2/files/download");
			xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
			xhr.setRequestHeader(
				"Dropbox-API-Arg",
				JSON.stringify({ path: "/" + fileName })
			);
			xhr.send();
		});
	}

	async svAlbum(album: Album) {
		this.loading = true;
		const oldFileName = this.fileName;
		const oldFileNameWith_ = oldFileName + "_";
		try {
			await this.rnmAlbum(oldFileName, oldFileNameWith_);
		} catch (e) {}

		return new Promise((resolve, reject) => {
			const file = album.toBlob();
			const xhr = new XMLHttpRequest();

			xhr.onload = async () => {
				if (xhr.status === 200) {
					this.delAlbum(oldFileName + "_")
						.then(() => {
							resolve();
							this.loading = false;
						})
						.catch(() => {
							resolve();
							this.loading = false;
						});
				} else {
					await this.rnmAlbum(oldFileName, oldFileNameWith_);
					return reject(xhr.response || "Unable to upload file");
				}
			};
			xhr.onerror = () => (this.loading = false);

			xhr.open("POST", "https://content.dropboxapi.com/2/files/upload");
			xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
			xhr.setRequestHeader("Content-Type", "application/octet-stream");
			xhr.setRequestHeader(
				"Dropbox-API-Arg",
				JSON.stringify({
					path: "/" + album.fileName,
					mode: {
						".tag": "overwrite"
					},
					autorename: false,
					mute: false
				})
			);

			xhr.send(file);
		});
	}

	rnmAlbum(oldName: string, newName: string) {
		this.loading = true;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.onload = () => {
				this.loading = false;
				if (xhr.status === 200) {
					return resolve();
				} else {
					return reject(xhr.response || "Unable to rename file");
				}
			};
			xhr.onerror = () => (this.loading = false);

			xhr.open("POST", "https://api.dropboxapi.com/2/files/move_v2");
			xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
			xhr.setRequestHeader("Content-Type", "application/json");

			xhr.send(
				JSON.stringify({
					from_path: "/" + oldName,
					to_path: "/" + newName,
					allow_shared_folder: false,
					autorename: false,
					allow_ownership_transfer: false
				})
			);
		});
	}

	delAlbum(fileName: string) {
		this.loading = true;
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.onload = () => {
				this.loading = true;
				if (xhr.status === 200) {
					return resolve();
				} else {
					return reject(xhr.response || "Unable to delete file");
				}
			};
			xhr.onerror = () => (this.loading = false);

			xhr.open("POST", "https://api.dropboxapi.com/2/files/delete_v2");
			xhr.setRequestHeader("Authorization", "Bearer " + this.accessToken);
			xhr.setRequestHeader("Content-Type", "application/json");

			xhr.send(JSON.stringify({ path: "/" + fileName }));
		});
	}

	constructor() {
		observe(this.path, () => {
			this.validateToken().then(() => this.validateFile());
		});
		setInterval(() => this.synchnronizeWithHash(), 200);
	}

	synchnronizeWithHash() {
		const hashInfo = this.getHashInfo();
		this.path[0] = hashInfo[0] || "";
		this.path[1] = hashInfo[1] || "";
	}

	getHashInfo() {
		return location.hash.substr(3).split("/");
	}

	setHash(accessToken: string, fileName: string) {
		location.href = `#!/${accessToken}${fileName ? `/${fileName}` : ""}`;
	}
}

export const main = new MainData();
