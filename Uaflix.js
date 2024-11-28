(function () {
    // Основные параметры плагина
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
        apiBaseUrl: 'https://uafix.net',  // Базовый URL для работы с uafix.net
    };

    // Проверка на повторную регистрацию плагина
    if (window.plugin_registered && window.plugin_registered.includes(plugin.id)) {
        return;
    }

    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    window.plugin_registered.push(plugin.id);  // Регистрируем плагин

    // Регистрация плагина в системе Lampa
    Lampa.Plugin.add({
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        version: plugin.version,
        settings: function () {
            return {
                title: plugin.name,
                icon: 'icon__movie',  // Иконка плагина
                description: plugin.description,
                onClick: function () {
                    Lampa.Noty.show('Плагин UAFix активирован!');
                    loadMoviesAndSeries();
                }
            };
        },
        init: function () {
            console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
        }
    });

    // Функция для получения данных о фильмах и сериалах
    function getMoviesAndSeries() {
        return fetch(`${plugin.apiBaseUrl}/api/films`)  // Пример API для получения фильмов
            .then(response => response.json())
            .catch(error => {
                console.error('Ошибка при загрузке данных о фильмах и сериалах:', error);
                Lampa.Noty.show('Не удалось загрузить данные о фильмах и сериалах');
            });
    }

    // Функция для отображения фильмов и сериалов
    function showMoviesAndSeries(movies) {
        const moviesList = document.createElement('div');
        moviesList.className = 'movies-list';

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerText = movie.title;

            movieCard.addEventListener('click', () => {
                showSeasons(movie.id);  // Переход к выборам сезонов
            });

            moviesList.appendChild(movieCard);
        });

        Lampa.View.append(moviesList);  // Добавление в интерфейс
    }

    // Функция для получения сезонов сериала
    function getSeasons(movieId) {
        return fetch(`${plugin.apiBaseUrl}/api/series/${movieId}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Ошибка при загрузке сезонов:', error);
                Lampa.Noty.show('Не удалось загрузить сезоны');
            });
    }

    // Функция для отображения сезонов сериала
    function showSeasons(movieId) {
        getSeasons(movieId).then(seasons => {
            const seasonsList = document.createElement('div');
            seasonsList.className = 'seasons-list';

            seasons.forEach(season => {
                const seasonCard = document.createElement('div');
                seasonCard.className = 'season-card';
                seasonCard.innerText = `Сезон ${season.number}`;

                seasonCard.addEventListener('click', () => {
                    showEpisodes(season.id);  // Переход к выбору серий
                });

                seasonsList.appendChild(seasonCard);
            });

            Lampa.View.append(seasonsList);  // Добавление в интерфейс
        });
    }

    // Функция для получения серий сезона
    function getEpisodes(seasonId) {
        return fetch(`${plugin.apiBaseUrl}/api/episodes/${seasonId}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Ошибка при загрузке серий:', error);
                Lampa.Noty.show('Не удалось загрузить серии');
            });
    }

    // Функция для отображения серий
    function showEpisodes(seasonId) {
        getEpisodes(seasonId).then(episodes => {
            const episodesList = document.createElement('div');
            episodesList.className = 'episodes-list';

            episodes.forEach(episode => {
                const episodeCard = document.createElement('div');
                episodeCard.className = 'episode-card';
                episodeCard.innerText = `Серия ${episode.number}: ${episode.title}`;

                episodeCard.addEventListener('click', () => {
                    playVideo(episode.videoUrl);  // Воспроизведение видео
                });

                episodesList.appendChild(episodeCard);
            });

            Lampa.View.append(episodesList);  // Добавление серий в интерфейс
        });
    }

    // Функция для воспроизведения видео
    function playVideo(videoUrl) {
        const videoPlayer = document.createElement('video');
        videoPlayer.src = videoUrl;
        videoPlayer.controls = true;
        videoPlayer.autoplay = true;
        videoPlayer.style.width = '100%';
        videoPlayer.style.height = 'auto';

        Lampa.View.append(videoPlayer);  // Воспроизведение видео
    }

    // Загрузка фильмов и сериалов
    function loadMoviesAndSeries() {
        getMoviesAndSeries().then(movies => {
            showMoviesAndSeries(movies);  // Показываем список фильмов и сериалов
        });
    }
})();
