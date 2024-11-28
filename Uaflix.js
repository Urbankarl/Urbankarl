(function () {
    const plugin = {
        id: 'zabba',
        name: 'Zabba',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    // Проверка на повторную регистрацию плагина
    if (window.plugin_registered && window.plugin_registered.includes(plugin.id)) {
        console.log('[Lampa] Плагин уже зарегистрирован');
        return;
    }

    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    window.plugin_registered.push(plugin.id);  // Регистрируем плагин
    console.log(`[Lampa] Регистрация плагина: ${plugin.name}`);

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
                    Lampa.Noty.show('Плагин Zabba активирован!');
                    loadSerials();  // В дальнейшем сюда будет добавлена логика
                }
            };
        },
        init: function () {
            console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
        },
        error: function () {
            console.error(`[Lampa] Ошибка при загрузке плагина "${plugin.name}"`);
        }
    });

    // Функция парсинга страницы uafix.net для получения данных о сериале
    function parseUafixSerialPage(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Пример: парсим название сериала
                    const title = doc.querySelector('.movie-title').textContent.trim();  // Название сериала (Дюна: Пророчество)

                    // Парсим сезоны
                    const seasons = [];
                    const seasonElements = doc.querySelectorAll('.seasons-list a');  // Уточните селектор для сезона
                    
                    seasonElements.forEach(item => {
                        const seasonTitle = item.textContent.trim();
                        const seasonUrl = item.getAttribute('href');  // Ссылка на сезон
                        seasons.push({ seasonTitle, seasonUrl });
                    });

                    // Парсим серии для первого сезона
                    const episodes = [];
                    const episodeElements = doc.querySelectorAll('.episodes-list a');  // Уточните селектор для серий
                    
                    episodeElements.forEach(item => {
                        const episodeTitle = item.textContent.trim();
                        const episodeUrl = item.getAttribute('href');  // Ссылка на серию
                        episodes.push({ episodeTitle, episodeUrl });
                    });

                    resolve({ title, seasons, episodes });
                })
                .catch(error => reject(error));
        });
    }

    // Функция для отображения сериала в интерфейсе Lampa
    function displaySerial(serial) {
        if (!serial || !serial.seasons || serial.seasons.length === 0) {
            Lampa.Noty.show('Нет доступных сезонов');
            return;
        }

        let seasonListHtml = serial.seasons.map(season => {
            return `
                <div class="season-item">
                    <a href="javascript:void(0);" onclick="loadEpisodes('${season.seasonUrl}')">
                        ${season.seasonTitle}
                    </a>
                </div>
            `;
        }).join('');

        Lampa.Dialog.show({
            title: serial.title,
            content: `<div class="season-list">${seasonListHtml}</div>`,
            actions: [{
                title: 'Закрыть',
                onClick: function () {
                    Lampa.Dialog.close();
                }
            }]
        });
    }

    // Функция для загрузки серий сезона
    function loadEpisodes(seasonUrl) {
        Lampa.Noty.show('Загрузка серий...');
        
        parseUafixSerialPage(seasonUrl)
            .then(serial => {
                displayEpisodes(serial);
            })
            .catch(error => {
                console.error('[Lampa] Ошибка при загрузке серий:', error);
                Lampa.Noty.show('Ошибка при загрузке серий');
            });
    }

    // Функция для отображения серий
    function displayEpisodes(serial) {
        if (!serial || !serial.episodes || serial.episodes.length === 0) {
            Lampa.Noty.show('Нет доступных серий');
            return;
        }

        let episodeListHtml = serial.episodes.map(episode => {
            return `
                <div class="episode-item">
                    <a href="javascript:void(0);" onclick="playEpisode('${episode.episodeUrl}')">
                        ${episode.episodeTitle}
                    </a>
                </div>
            `;
        }).join('');

        Lampa.Dialog.show({
            title: 'Выберите серию',
            content: `<div class="episode-list">${episodeListHtml}</div>`,
            actions: [{
                title: 'Закрыть',
                onClick: function () {
                    Lampa.Dialog.close();
                }
            }]
        });
    }

    // Функция для воспроизведения серии
    function playEpisode(episodeUrl) {
        Lampa.Noty.show('Загрузка серии...');
        
        parseUafixSerialPage(episodeUrl).then(episodeData => {
            const videoUrl = episodeData.videoUrl;  // Получаем ссылку на видео
            
            if (videoUrl) {
                Lampa.Player.play(videoUrl);
            } else {
                Lampa.Noty.show('Ошибка при получении видео');
            }
        }).catch(error => {
            console.error('[Lampa] Ошибка при загрузке серии:', error);
            Lampa.Noty.show('Ошибка при загрузке серии');
        });
    }

    // Функция для загрузки данных о сериале с сайта uafix.net
    function loadSerials() {
        Lampa.Noty.show('Загрузка сериалов с uafix.net...');
        
        const serialUrl = 'https://uafix.net/serials/djuna-proroctvo/';
        
        parseUafixSerialPage(serialUrl)
            .then(serial => {
                displaySerial(serial);
            })
            .catch(error => {
                console.error('[Lampa] Ошибка при загрузке данных с uafix.net:', error);
                Lampa.Noty.show('Ошибка при загрузке данных с uafix.net');
            });
    }

})();
