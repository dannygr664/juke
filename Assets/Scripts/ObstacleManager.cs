using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObstacleManager : MonoBehaviour
{
    [SerializeField]
    private ExplodingWall wall;
    private bool isWallDestroyed;

    // Start is called before the first frame update
    void Start()
    {
        isWallDestroyed = false;
    }

    // Update is called once per frame
    void Update()
    {
        if (MusicManager.instance.Volume > 0.8f && !isWallDestroyed)
        {
            Destroy(wall.gameObject);
            isWallDestroyed = true;
            MusicManager.instance.UpdateComplexity(1);
        }
    }
}
