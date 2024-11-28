
(function () {
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    function fetchData(url, callback) {
        fetch(url)
            .then((response) => response.text())
            .then((html) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                callback(doc);
            })
            .catch((error) => {
                console.error(`[UAFix Plugin] Ошибка загрузки данных с ${url}:`, error);
                Lampa.Noty.show(`Ошибка загрузки данных`);
            });
    }

    function parseMovies(doc) {
        const movies = [];
        const items = doc.querySelectorAll('.movie-item a');
        items.forEach((item) => {
            movies.push({
                title: item.getAttribute('title') || 'Без названия',
                link: item.href,
            });
        });
        return movies;
    }

    function parseEpisodes(doc) {
        const episodes = [];
        const items = doc.querySelectorAll('.episodes-list a');
        items.forEach((item) => {
            episodes.push({
                title: item.textContent.trim(),
                link: item.href,
            });
        });
        return episodes;
    }

    function initPlugin() {
        Lampa.Component.add('uafix', function (component) {
            component.create = function () {
                this.activity.loader(true);
                fetchData('https://uafix.net/', (doc) => {
                    const movies = parseMovies(doc);
                    const html = movies
                        .map(
                            (movie) => `
                            <div class="card selector" data-link="${movie.link}">
                                <div class="card__title">${movie.title}</div>
                            </div>
                        `
                        )
                        .join('');

                    this.activity.loader(false);
                    this.html(html);

                    this.render().find('.selector').on('click', (e) => {
                        const link = e.currentTarget.dataset.link;
                        this.activity.loader(true);
                        fetchData(link, (doc) => {
                            const episodes = parseEpisodes(doc);
                            const html = episodes
                                .map(
                                    (episode) => `
                                    <div class="card selector" data-link="${episode.link}">
                                        <div class="card__title">${episode.title}</div>
                                    </div>
                                `
                                )
                                .join('');

                            this.activity.loader(false);
                            this.html(html);

                            this.render()
                                .find('.selector')
                                .on('click', (e) => {
                                    const videoLink = e.currentTarget.dataset.link;
                                    Lampa.Player.play({
                                        title: 'Видео с UAFix',
                                        url: videoLink,
                                    });
                                });
                        });
                    });
                });
            };
        });

        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',
            description: plugin.description,
            onClick: function () {
                Lampa.Activity.push({
                    component: 'uafix',
                    name: 'UAFix',
                    type: 'movie',
                });
            },
        });

        console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
    }

    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    if (!window.plugin_registered.includes(plugin.id)) {
        window.plugin_registered.push(plugin.id);
        initPlugin();
    }
})();
