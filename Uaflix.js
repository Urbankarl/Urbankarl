(function () {
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    // Проверка на загрузку плагина, чтобы избежать дублирования
    if (window.plugin_registered && window.plugin_registered.includes(plugin.id)) {
        return;
    }

    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    window.plugin_registered.push(plugin.id);  // Регистрируем плагин

    // Функция инициализации плагина
    function initPlugin() {
        // Добавляем плагин в настройки Lampa
        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',  // Иконка для плагина
            description: plugin.description,
            onClick: function () {
                Lampa.Noty.show('Плагин UAFix активирован!');
            }
        });

        // Добавляем иконку на карточки видео
        Lampa.Component.add('card', function (card) {
            const icon = document.createElement('div');
            icon.className = 'card__icon';
            icon.innerText = 'UAFix';  // Текст на иконке

            // Обработчик клика по иконке
            icon.addEventListener('click', function () {
                Lampa.Noty.show('Открытие через UAFix...');
                // Здесь вы можете добавить логику для открытия контента через плагин
            });

            card.appendChild(icon);  // Добавляем иконку в карточку
        });

        console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
    }

    // Инициализация плагина
    initPlugin();
})();
