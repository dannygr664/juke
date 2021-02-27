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
        MusicManager.BeatUpdated += CheckObstacles;
    }

    private void Update()
    {
    }

    private void OnDestroy()
    {
        MusicManager.BeatUpdated -= CheckObstacles;
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
