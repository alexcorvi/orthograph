import { observable } from "mobx";
import { graphTypes } from "./album-data";

class AlbumView {
	@observable showGraphs: boolean[] = graphTypes.map(() => true);
	@observable thumbnailSize: number = 300;
	@observable showTopLists: boolean = true;
	@observable mountPoints: boolean = true;

	updateLines() {
		this.mountPoints = false;
		setTimeout(() => {
			this.mountPoints = true;
		}, 500);
	}

	constructor() {
		window.addEventListener("resize", () => this.updateLines());
	}
}

export const albumView = new AlbumView();
