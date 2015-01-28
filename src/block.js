/** 
 *  @constructor
 *  @extends Floatable
 */
function Block(height, numTransactions, diff, blockSize) {
	if (document.visibilityState === "visible") {
		Floatable.call(this);

		var blockSizeKB = Math.floor(blockSize / 1024) + " KB";

		this.width = this.height = 500;

		this.addImage(blockImage, this.width, this.height);
		this.addText("Block #" + height + "<br />Number of Transactions: " + numTransactions + "<br />Difficulty: " + diff + "<br />Block Size: " + blockSizeKB);
		this.initPosition();
	}
	
	// Sound
	Sound.playRandomSwell();
}

extend(Floatable, Block);
