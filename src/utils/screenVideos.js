const modules = import.meta.glob('../assets/screens/*.{mp4,webm,mov,ogg}', {
    eager: true,
    import: 'default',
});

export const screenVideos = Object.entries(modules)
    .map(([path, url]) => ({
        id: path,
        name: path
            .split('/')
            .pop()
            .replace(/\.[^.]+$/, ''),
        url,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
