
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

    function initPlugin() {
        // Добавляем плагин в настройки Lampa
        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',
            description: plugin.description,
            onClick: function () {
                Lampa.Noty.show('Плагин UAFix активирован!');
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
