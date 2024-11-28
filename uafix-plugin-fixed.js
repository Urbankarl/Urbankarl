(function () {
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    function initPlugin() {
        // Добавляем плагин в меню настроек
        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',
            description: plugin.description,
            onClick: function () {
                Lampa.Noty.show('Плагин UAFix активирован!');
            },
        });

        // Добавляем обработчик иконки плагина на карточки видео
        Lampa.Component.add('card', function (card) {
            const icon = document.createElement('div');
            icon.className = 'card__icon';
            icon.innerText = 'UAFix';

            card.append(icon);

            icon.addEventListener('click', function () {
                Lampa.Noty.show('Открывается видео через UAFix');
            });
        });

        console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
    }

    // Регистрируем плагин
    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    if (!window.plugin_registered.includes(plugin.id)) {
        window.plugin_registered.push(plugin.id);
        initPlugin();
    }
})();
