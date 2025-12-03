module Counter exposing (main)

import Browser
import Html exposing (Html, button, div, text, p)
import Html.Attributes exposing (style, id)
import Html.Events exposing (onClick)

type alias Model = 
  { count : Int
  , targetNumber : Int
  , hasReachedTarget : Bool
  }

type Msg = Increment | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment -> 
      let newCount = model.count + 1 in
      { model | count = newCount, hasReachedTarget = newCount >= model.targetNumber }
    Decrement -> 
      if model.count > 0 then
        { model | count = model.count - 1, hasReachedTarget = False }
      else
        model

view : Model -> Html Msg
view model =
  div []
    [ div [ style "display" "flex", style "align-items" "center", style "gap" "1.5rem", style "justify-content" "center" ]
        [ button [ onClick Decrement, style "padding" "0.5rem 1rem", style "font-size" "1.5rem", style "cursor" "pointer", style "border" "none", style "border-radius" "5px", style "background" "#ff6b6b", style "color" "white", style "transition" "background 0.3s", style "font-weight" "bold" ] [ text "-" ]
        , div [ style "font-size" "2rem", style "font-weight" "bold", style "min-width" "80px", style "text-align" "center", style "color" "white" ] [ text (String.fromInt model.count) ]
        , button [ onClick Increment, style "padding" "0.5rem 1rem", style "font-size" "1.5rem", style "cursor" "pointer", style "border" "none", style "border-radius" "5px", style "background" "#51cf66", style "color" "white", style "transition" "background 0.3s", style "font-weight" "bold" ] [ text "+" ]
        ]
    , p [ style "color" "white", style "text-align" "center", style "margin-top" "1.5rem", style "font-size" "1rem" ] 
        [ text ("目标: " ++ String.fromInt model.targetNumber) ]
    , if model.hasReachedTarget then
        p [ id "success-message", style "color" "#ffd700", style "text-align" "center", style "font-size" "1.2rem", style "font-weight" "bold", style "margin-top" "1rem" ] 
          [ text "🎉 恭喜! 正在跳转到个人主页..." ]
      else
        text ""
    ]

main : Program { targetNumber : Int } Model Msg
main =
  Browser.element 
    { init = \flags -> ({ count = 0, targetNumber = flags.targetNumber, hasReachedTarget = False }, Cmd.none)
    , update = \msg model -> (update msg model, Cmd.none)
    , view = view
    , subscriptions = \_ -> Sub.none
    }