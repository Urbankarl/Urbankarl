(function () {
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    // Функция для инициализации плагина
    function initPlugin() {
        // Регистрация плагина в меню настроек Lampa
        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',  // Иконка плагина
            description: plugin.description,
            onClick: function () {
                Lampa.Noty.show('Плагин UAFix активирован!');
            }
        });

        // Добавляем обработчик для карточек видео
        Lampa.Component.add('card', function (card) {
            const icon = document.createElement('div');
            icon.className = 'card__icon';
            icon.innerText = 'UAFix';

            // При клике на иконку показываем сообщение
            icon.addEventListener('click', function () {
                Lampa.Noty.show('Открывается видео через UAFix');
            });

            card.appendChild(icon);
        });

        console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
    }

    // Проверяем, зарегистрирован ли уже плагин
    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    // Регистрация плагина только один раз
    if (!window.plugin_registered.includes(plugin.id)) {
        window.plugin_registered.push(plugin.id);
        initPlugin();
    }
})();
