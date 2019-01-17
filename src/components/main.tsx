import * as data from "../data/album-data";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AlbumView } from "./album";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Start } from "./start";
import { main } from "../data/main";

@observer
export class Main extends React.Component<{}> {
	@observable album: data.Album | undefined = undefined;

	render() {
		return (
			<main className="main">
				{main.openedAlbum ? <AlbumView /> : <Start />}
				{main.loading ? (
					<div className="loader-container">
						<div className="loader" />
					</div>
				) : (
					""
				)}
			</main>
		);
	}
}
