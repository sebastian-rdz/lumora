export function getOverviewPose(layout) {
    const { roomWidth, roomDepth, ceilingHeight } = layout;
    const position = [roomWidth * 0.22, ceilingHeight * 0.62, roomDepth * 0.62];
    const target = [0, ceilingHeight * 0.32, roomDepth * 0.38];
    return { position, target };
}
