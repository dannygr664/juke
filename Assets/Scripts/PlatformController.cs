using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.U2D;
using FMODUnity;

public class PlatformController : MonoBehaviour
{
    public int beatsBetweenBlinks;
    public float blinkTime;

    BoxCollider2D[] platformColliders;
    SpriteShapeRenderer[] platformRenderers;
    Color platformColor;
    StudioEventEmitter music;
    int blinkCounter;

    private void Awake()
    {
        platformColliders = GetComponentsInChildren<BoxCollider2D>().Where(c => !c.CompareTag("4-4Background")).ToArray();
        platformRenderers = GetComponentsInChildren<SpriteShapeRenderer>().Where(r => !r.CompareTag("4-4Background")).ToArray();
        platformColor = (platformRenderers.Length > 0) ? platformRenderers[0].color : Color.black;
        music = GameObject.FindWithTag("Player").GetComponent<StudioEventEmitter>();
        blinkCounter = beatsBetweenBlinks;
    }


    private void BlinkPlatform()
    {
        foreach (BoxCollider2D c in platformColliders)
        {
            c.isTrigger = true;
        }
        foreach (SpriteShapeRenderer r in platformRenderers)
        {
            r.color = Color.white;
        }

        //yield return new WaitForSeconds(blinkTime);
        foreach (BoxCollider2D c in platformColliders)
        {
            c.isTrigger = false;
        }
        foreach (SpriteShapeRenderer r in platformRenderers)
        {
            r.color = platformColor;
        }
    }
}
