const plugin = {
    name: 'stas', // Название плагина
    version: '1.0', // Версия плагина
    description: 'Плагин для парсинга uafix.net',
    
    // Регистрация плагина
    init: function () {
        lampa.api.registerPlugin('stas', {
            onSearch: this.search,  // Метод для обработки поиска
            onPlay: this.playVideo,  // Метод для воспроизведения видео
        });
    },

    // Метод для поиска на сайте uafix.net
    search: function(query) {
        // URL для поиска на uafix.net
        const searchUrl = `https://uafix.net/?s=${encodeURIComponent(query)}`;
        
        fetch(searchUrl)
            .then(response => response.text())
            .then(pageContent => {
                // Здесь парсим HTML-страницу сайта uafix.net для поиска
                const parser = new DOMParser();
                const doc = parser.parseFromString(pageContent, 'text/html');
                
                // Пример парсинга — извлекаем ссылки на видео
                const videos = [];
                const videoElements = doc.querySelectorAll('.post-item'); // Пример селектора для поиска видео
                videoElements.forEach(element => {
                    const title = element.querySelector('.post-title').textContent.trim();
                    const videoLink = element.querySelector('a').href;
                    videos.push({ title, videoLink });
                });

                // Отправляем результаты в интерфейс
                lampa.api.showMenu(videos.map(video => ({
                    title: video.title,
                    action: () => this.playVideo(video.videoLink)
                })));
            })
            .catch(err => {
                console.error('Ошибка при поиске на сайте:', err);
            });
    },

    // Метод для воспроизведения видео
    playVideo: function(videoUrl) {
        lampa.api.addPlayer(videoUrl);
        lampa.api.play();
    }
};

// Инициализация плагина
plugin.init();
