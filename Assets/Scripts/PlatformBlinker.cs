using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.U2D;

public class PlatformBlinker : MonoBehaviour
{
    BoxCollider2D collider;
    SpriteRenderer renderer;
    Color platformColor;

    public int blinkInterval;

    int blinkCounter;

    private void Awake()
    {
        collider = GetComponent<BoxCollider2D>();
        renderer = GetComponent<SpriteRenderer>();
        platformColor = renderer.color;
        collider.isTrigger = false;
        blinkCounter = blinkInterval - 1;
        MusicManager.beatUpdated += Blink;
        MusicManager.timeSignatureUpdated += UpdateBlinkRate;
    }

    private void OnDestroy()
    {
        MusicManager.beatUpdated -= Blink;
        MusicManager.timeSignatureUpdated -= UpdateBlinkRate;
    }

    private void Blink()
    {
        if (blinkCounter > 0)
        {
            if (blinkCounter == (blinkInterval - 1))
            {
                collider.isTrigger = false;
                renderer.color = new Color(platformColor.r, platformColor.g, platformColor.b, 1.0f);
            }
            blinkCounter--;
        }
        else
        {
            collider.isTrigger = true;
            renderer.color = new Color(platformColor.r, platformColor.g, platformColor.b, 0.2f);

            blinkCounter = blinkInterval - 1;
        }
    }

    private void UpdateBlinkRate()
    {
        blinkInterval = MusicManager.instance.timelineInfo.timeSignatureUpper;
        blinkCounter = blinkInterval - 1;
    }
}
