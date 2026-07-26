export const ROOM_CONFIG = {
    rows: 11, // A to K
    leftBlock: 4,
    centerBlock: 10,
    rightBlock: 4,
    seatSpacing: 0.56,
    aisleWidth: 1.3,
    rowPitchBase: 1.05,
    firstRowDistance: 4.6,
    eyeHeight: 1.15,
    screenWidth: 13,
    screenHeight: 5.6,
    screenBottom: 1.55,
    wallMargin: 2.4,
    frontMargin: 1.9,
    backMargin: 2.6,
};

const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function buildCinemaLayout(config = ROOM_CONFIG) {
    const {
        rows,
        leftBlock,
        centerBlock,
        rightBlock,
        seatSpacing,
        aisleWidth,
        rowPitchBase,
        firstRowDistance,
        eyeHeight,
        wallMargin,
        frontMargin,
        backMargin,
    } = config;

    const blocks = [leftBlock, centerBlock, rightBlock];
    const rowWidth = blocks.reduce((a, b) => a + b, 0) * seatSpacing + (blocks.length - 1) * aisleWidth;

    const rowsMeta = [];
    const seats = [];

    let y = 0;
    let z = firstRowDistance;

    for (let r = 0; r < rows; r++) {
        if (r > 0) {
            const rise = 0.15 + r * 0.009;
            const pitch = rowPitchBase + r * 0.01;
            y += rise;
            z += pitch;
        }
        const letter = ROW_LETTERS[r] ?? `F${r}`;
        rowsMeta.push({ index: r, letter, y, z });

        let cursorX = -rowWidth / 2;
        let seatNumber = 1;
        blocks.forEach((count) => {
            for (let s = 0; s < count; s++) {
                const x = cursorX + seatSpacing / 2 + s * seatSpacing;
                seats.push({
                    id: `${letter}-${seatNumber}`,
                    row: letter,
                    rowIndex: r,
                    number: seatNumber,
                    x,
                    y,
                    z,
                    eyeHeight,
                });
                seatNumber++;
            }
            cursorX += count * seatSpacing + aisleWidth;
        });
    }

    const roomWidth = rowWidth + wallMargin * 2;
    const roomDepth = z + backMargin;
    const frontZ = firstRowDistance - frontMargin;
    const ceilingHeight = rowsMeta[rowsMeta.length - 1].y + 4.6;

    return { seats, rowsMeta, rowWidth, roomWidth, roomDepth, frontZ, ceilingHeight, blocks, config };
}

export function groupSeatsByRow(seats) {
    const map = new Map();
    for (const seat of seats) {
        if (!map.has(seat.row)) map.set(seat.row, []);
        map.get(seat.row).push(seat);
    }
    return [...map.entries()].map(([row, list]) => ({ row, seats: list }));
}
