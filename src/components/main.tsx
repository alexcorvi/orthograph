import * as data from "../data";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AlbumView } from "./album";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Start } from "./start";

@observer
export class Main extends React.Component<{}> {
	@observable album: data.Album | undefined = undefined;

	componentDidMount() {
		window.onmessage = e => {
			let messageData = e.data;
			if (!messageData) return;
			if (typeof messageData !== "string") return;
			if (!messageData.startsWith("orthograph-open:")) return;
			messageData = messageData.split("orthograph-open:")[1];
			data.viewControl.asInternalApplication = true;
			try {
				messageData = JSON.parse(messageData);
				this.album = new data.Album(messageData);
			} catch (e) {
				const newAlbum = new data.Album();
				newAlbum.title = messageData;
				this.album = newAlbum;
			}
		};
	}

	render() {
		return (
			<main className="main">
				{this.album ? (
					<AlbumView album={this.album} />
				) : (
					<Start onHavingAlbum={album => (this.album = album)} />
				)}
			</main>
		);
	}
}
