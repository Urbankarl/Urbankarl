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
                    loadMoviesAndSeries();  // В дальнейшем сюда будет добавлена логика
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

    // Функция загрузки данных о фильмах и сериалах с uafix.net
    function loadMoviesAndSeries() {
        Lampa.Noty.show('Загрузка фильмов и сериалов с uafix.net...');
        // Пример вызова функции, которая будет в дальнейшем реализована
        // Например, API-запросы к uafix.net для получения данных
        console.log('[Lampa] Функция загрузки фильмов и сериалов с uafix.net');
    }
})();
