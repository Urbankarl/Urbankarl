(function () {
    // Определяем основные параметры плагина
    const plugin = {
        id: 'uafix-plugin',
        name: 'UAFix',
        version: '1.0.0',
        description: 'Плагин для просмотра фильмов и сериалов с сайта uafix.net',
    };

    // Проверка, чтобы избежать многократной регистрации
    if (window.plugin_registered && window.plugin_registered.includes(plugin.id)) {
        return;
    }

    if (!window.plugin_registered) {
        window.plugin_registered = [];
    }

    window.plugin_registered.push(plugin.id);  // Регистрируем плагин

    // Функция для добавления плагина в меню настроек
    function initPlugin() {
        Lampa.Settings.add({
            title: plugin.name,
            icon: 'icon__movie',  // Иконка плагина
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

            // При клике на иконку показываем уведомление
            icon.addEventListener('click', function () {
                Lampa.Noty.show('Открытие через UAFix...');
                // Здесь можно добавить логику для открытия контента через UAFix
                window.open('https://uafix.net', '_blank');  // Пример открытия сайта
            });

            card.appendChild(icon);  // Добавляем иконку на карточку
        });

        console.log(`[Lampa] Плагин "${plugin.name}" версии ${plugin.version} успешно загружен`);
    }

    // Инициализация плагина
    initPlugin();
})();
