# MDMS zone work: пошаговые коммиты

Папка лежит вне репозитория. Здесь готовый код (`final/`) и план из 16 веток / 41 коммита.
`apply.mjs` за один запуск делает **один** следующий коммит с текущей датой и твоим git-пользователем.
Пушить, открывать PR и мержить — вручную.

## Команды (из корня репозитория MDMS)

```powershell
node ..\MDMS-zone-staging\apply.mjs status   # план: [x] сделано, [ ] осталось
node ..\MDMS-zone-staging\apply.mjs next     # следующий коммит
```

`next` сам:
- создаёт ветку от `Alex-branch`, если это первый коммит ветки;
- пишет файлы этого шага (для data-шагов ещё и пересобирает `db.json`);
- прогоняет `tsc` и `eslint`; если есть ошибка, коммита не будет;
- коммитит; после последнего коммита ветки подсказывает, что пушить.

Какие шаги уже сделаны, определяется по сообщениям коммитов в git, отдельного файла состояния нет.

## Цикл одной ветки

```powershell
node ..\MDMS-zone-staging\apply.mjs next      # столько раз, сколько коммитов в ветке
git push -u origin feature/<имя>
# PR в Alex-branch на GitHub -> ревью тиммейта -> merge
git switch Alex-branch
git pull
```

Перед первой веткой один раз запушить саму базу: `git push -u origin Alex-branch`.

Без GitHub можно мержить локально: `git switch Alex-branch` и `git merge --no-ff feature/<имя>`.

## Проверки, которые не дадут ошибиться

- Рабочее дерево должно быть чистым (свои правки сначала закоммить или застешь).
- Новая ветка создаётся только с `Alex-branch`, и только если предыдущая ветка плана уже в неё смержена.

## Порядок веток

1. fix/reset-password-casing (1)
2. feature/zone-data (2)
3. feature/theme (2)
4. feature/ui-components (6)
5. feature/select-toggle-fields (2)
6. feature/api-layer (4)
7. feature/data-table (4)
8. feature/charts (3)
9. feature/app-layout (3)
10. feature/zone-setup (3)
11. feature/zone-dashboard (1)
12. feature/zone-meters (5)
13. feature/zone-users (2)
14. feature/zone-reports (1)
15. feature/zone-alerts (1)
16. feature/zone-settings (1)

Код сдать в `main` до **вс 29 ноября 23:59**.

`mdms-backup.bundle` — полная копия старой истории на всякий случай. Восстановить: `git fetch ..\MDMS-zone-staging\mdms-backup.bundle "refs/heads/*:refs/restored/*"`.
