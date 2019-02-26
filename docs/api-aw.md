# Client

обертка

```
{
  event: String,
  data: Any,
}
```

0. рестарт

```
{
  "event":"restart"
}
```

1. проверка системы

```
{
  "event":"systemCheck"
}
```

2. установить мод поливки

- TRUE = каждый час
- FALSE = каждый день

```
{
  "event":"setWateringMode",
  "data": String
}
```

3. установить автоматическое тестирование

- TRUE = включить
- FALSE = выключить

```
{
  "event":"setautotesting",
  "data": Boolean
}
```

4. установить аналитику сенсора

- TRUE = включить
- FALSE = выключить

```
{
  "event":"setsensorAnalysis",
  "data": Boolean
}
```

5. установить энергосбережение

- TRUE = включить
- FALSE = выключить

```
{
  "event":"setenergySavingMode",
  "data": Boolean
}
```

6. установить автоматическое поливание

- TRUE = включить
- FALSE = выключить

```
{
  "event":"setAutomaticWatering",
  "data": Boolean
}
```

7. установить уровень желаемой влажности почвы

```
{
  "event":"setHumidity",
  "data": Number
}
```

# Server

0. При подключении клиента

```
{
  dataHumidity: Array,        // значения замеров влажности почвы
  dateWatering: Number,       // дата начала автополива
  automaticWatering: Boolean, // автополив
  autotesting: Boolean,       // автотестирование
  sensorAnalysis: Boolean,    // анализ датчиков
  wateringMode: Boolean,      // частота полива час/день
  microcontroller: String,    // название системы (вдруг их несколько)
  humidity: Number,           // настройка влажности почвы
}

// EXEMPLE
{
  dataHumidity: [69, 53, 73, 60, 68, 61, 59, 64, 65, 50, 60, 73, 55, 76, 57, 75, 60, 65, 57, 56, 73, 53, 73, 60,53, 57, 77, 73, 54, 51, 63, 53, 61, 58, 74, 77, 61, 68, 76, 63, 53, 57, 77, 73, 54, 51, 63,53,58, 56, 71, 61, 58, 74, 77, 61, 68, 76, 63, 53, 57, 77, 73, 54, 51, 63, 53, 58, 56, 71,61, 58,74, 77, 61, 68, 76, 63, 53, 58, 56, 71, 61, 58, 74, 77, 61, 68, 76, 63, 53, 57, 77,73, 54, 51,63, 53, 58, 56, 71, 61, 58, 74, 77, 61, 68, 76, 63, 53, 57, 77, 73, 54, 51, 63,53, 58, 56, 71,61, 58, 74, 77, 61, 68, 76, 63, 68, 76, 63, 53, 57, 77, 73, 54, 51, 63, 53,58, 56, 71, 61, 58,74, 77, 61, 68, 76, 63, 68, 76, 63, 53, 57, 77, 73 56, 71, 61, 58, 74, 77,61, 68, 76, 63,
  ],
  dateWatering: 1526381147614,
  automaticWatering: true,
  autotesting: false,
  sensorAnalysis: false,
  wateringMode: false,
  microcontroller: 'Arduino ESP8266',
  humidity: 22,
}
```

1. Произведен замер влажности почвы

```
{
  "event": "newHumidity",
  "data": Number
}
```
