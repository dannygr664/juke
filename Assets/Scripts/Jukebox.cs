using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Jukebox : MonoBehaviour
{
    private SpriteRenderer renderer;

    public SpriteRenderer background;
    public SpriteRenderer platform;
    public SpriteRenderer player;

    public float colorTransitionSpeed;
    Color backgroundColorG;
    Color platformColorG;
    Color playerColorG;
    float colorTransitionCounter;

    bool comingFromLeft;

    // Start is called before the first frame update
    void Start()
    {
        renderer = GetComponent<SpriteRenderer>();
        ColorUtility.TryParseHtmlString("#F0EDE3", out backgroundColorG);
        ColorUtility.TryParseHtmlString("#424660", out platformColorG);
        ColorUtility.TryParseHtmlString("#B4935D", out playerColorG);
        colorTransitionCounter = 1.0f;
        comingFromLeft = false;
    }

    // Update is called once per frame
    void Update()
    {
        if (colorTransitionCounter < 1.0f)
        {
            if (comingFromLeft)
            {
                platform.color = Color.Lerp(Color.black, platformColorG, colorTransitionCounter);
                background.color = Color.Lerp(Color.white, backgroundColorG, colorTransitionCounter);
                player.color = Color.Lerp(Color.black, playerColorG, colorTransitionCounter);
                renderer.color = Color.Lerp(Color.white, Color.black, colorTransitionCounter);
            }
            else
            {
                platform.color = Color.Lerp(platformColorG, Color.black, colorTransitionCounter);
                background.color = Color.Lerp(backgroundColorG, Color.white, colorTransitionCounter);
                player.color = Color.Lerp(playerColorG, Color.black, colorTransitionCounter);
                renderer.color = Color.Lerp(Color.black, Color.white, colorTransitionCounter);
            }

            colorTransitionCounter += Time.deltaTime * colorTransitionSpeed;
        }
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        colorTransitionCounter = 0.0f;
        comingFromLeft = !comingFromLeft;
        if (comingFromLeft)
        {
            renderer.sortingOrder = 1;
        }
        else
        {
            renderer.sortingOrder = -1;
        }
    }
}
