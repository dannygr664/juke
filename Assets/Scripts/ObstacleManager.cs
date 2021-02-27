using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObstacleManager : MonoBehaviour
{
    [SerializeField]
    private ExplodingWall wall;
    private bool isWallDestroyed;

    private void Start()
    {
        isWallDestroyed = false;
        MusicManager.beatUpdated += CheckObstacles;
    }

    private void Update()
    {
    }

    private void CheckObstacles()
    {
        if (!isWallDestroyed)
        {
            CheckWall();
        }
    }

    private void CheckWall()
    {
        if (MusicManager.instance.Volume > 0.8f)
        {
            Destroy(wall.gameObject);
            isWallDestroyed = true;
            MusicManager.instance.UpdateComplexity(1);
        }
    }
}
