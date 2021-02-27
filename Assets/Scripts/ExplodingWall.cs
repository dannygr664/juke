using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ExplodingWall : MonoBehaviour
{
    private SpriteRenderer renderer;
    private Collider2D collider;

    public ParticleSystem explosion;

    private void Start()
    {
        renderer = GetComponent<SpriteRenderer>();
        collider = GetComponent<Collider2D>();
    }

    public void Explode()
    {
        renderer.color = Color.clear;
        collider.isTrigger = true;
        explosion.Play();
    }
}
