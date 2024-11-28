(function () {
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    // Инициализация плагина
    function initPlugin() {
        // Добавление плагина в меню настроек Lampa
        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',  // Это иконка, которую вы хотите использовать
            description: plugin.description,
            onClick: function () {
                Lampa.Noty.show('Плагин UAFix активирован!');
            }
        });

        // Добавление кнопки в карточки видео
        Lampa.Component.add('card', function (card) {
            const icon = document.createElement('div');
            icon.className = 'card__icon';
            icon.innerText = 'UAFix';

            // Обработчик клика на иконку
            icon.addEventListener('click', function () {
                Lampa.Noty.show('Открытие через UAFix...');
            });

            card.appendChild(icon); // Добавление иконки на карточку
        });

        console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
    }

    // Проверка на регистрацию плагина
    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    // Регистрация плагина
    if (!window.plugin_registered.includes(plugin.id)) {
        window.plugin_registered.push(plugin.id);
        initPlugin();
    }
})();
