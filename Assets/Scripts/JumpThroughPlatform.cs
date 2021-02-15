using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.U2D;

public class JumpThroughPlatform : MonoBehaviour
{
    BoxCollider2D collider;
    SpriteShapeRenderer renderer;
    Color platformColor;

    bool isSpaceDown;

    public int blinkInterval;
    public float blinkTime;

    int blinkCounter;

    private void Awake()
    {
        collider = GetComponent<BoxCollider2D>();
        renderer = GetComponent<SpriteShapeRenderer>();
        platformColor = renderer.color;
        collider.isTrigger = false;
        blinkCounter = blinkInterval - 1;
        MusicManager.beatUpdated += Blink;
    }

    // Update is called once per frame
    void Update()
    {
        if (!isSpaceDown)
        {
            isSpaceDown = Input.GetKeyDown(KeyCode.Space);
        }
    }

    private void FixedUpdate()
    {
        if (isSpaceDown)
        {
            isSpaceDown = false;
            collider.isTrigger = true;
            StartCoroutine("EnableCollider");
        }
    }

    private void OnDestroy()
    {
        MusicManager.beatUpdated -= Blink;
    }

    IEnumerator EnableCollider()
    {
        yield return new WaitForSeconds(0.5f);
        collider.isTrigger = false;
    }

    private void Blink()
    {
        if (blinkCounter > 0)
        {
            if (blinkCounter == (blinkInterval - 1))
            {
                collider.isTrigger = false;
                renderer.color = platformColor;
            }
            blinkCounter--;
        }
        else
        {
            collider.isTrigger = true;
            renderer.color = Color.white;

            blinkCounter = blinkInterval - 1;
        }
    }
}
