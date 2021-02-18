using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Jukebox : MonoBehaviour
{
    private SpriteRenderer jukebox;

    public SpriteRenderer background;
    public SpriteRenderer platform;
    public SpriteRenderer player;

    public float colorTransitionSpeed;

    public Color oldBackgroundColor = Color.white;
    public Color oldPlatformColor = Color.black;
    public Color oldPlayerColor = Color.black;

    public Color newBackgroundColor = Color.white;
    public Color newPlatformColor = Color.black;
    public Color newPlayerColor = Color.black;

    float colorTransitionCounter;

    bool comingFromLeft;

    void Start()
    {
        jukebox = GetComponent<SpriteRenderer>();
        colorTransitionCounter = 1.0f;
        comingFromLeft = false;
    }

    void Update()
    {
        if (colorTransitionCounter < 1.0f)
        {
            if (comingFromLeft)
            {
                platform.color = Color.Lerp(oldPlatformColor, newPlatformColor, colorTransitionCounter);
                background.color = Color.Lerp(oldBackgroundColor, newBackgroundColor, colorTransitionCounter);
                player.color = Color.Lerp(oldPlayerColor, newPlayerColor, colorTransitionCounter);
                jukebox.color = Color.Lerp(newPlayerColor, oldPlayerColor, colorTransitionCounter);
            }
            else
            {
                platform.color = Color.Lerp(newPlatformColor, oldPlatformColor, colorTransitionCounter);
                background.color = Color.Lerp(newBackgroundColor, oldBackgroundColor, colorTransitionCounter);
                player.color = Color.Lerp(newPlayerColor, oldPlayerColor, colorTransitionCounter);
                jukebox.color = Color.Lerp(oldPlayerColor, newPlayerColor, colorTransitionCounter);
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
            jukebox.sortingOrder = 1;
        }
        else
        {
            jukebox.sortingOrder = -1;
        }
    }
}
