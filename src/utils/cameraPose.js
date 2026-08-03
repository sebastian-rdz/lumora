export function getOverviewPose(layout) {
    const { roomWidth, roomDepth, ceilingHeight } = layout;
    const position = [roomWidth * 0.18, ceilingHeight * 0.72, roomDepth * 0.85];
    const target = [0, ceilingHeight * 0.32, roomDepth * 0.38];
    return { position, target };
}
